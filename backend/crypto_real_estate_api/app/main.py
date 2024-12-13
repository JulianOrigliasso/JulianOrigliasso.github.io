from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
import psycopg
import secrets
import os

from .core.database import engine, get_db
from . import models, schemas, crud
from .models import user, property
from .core.auth import (
    create_access_token,
    get_current_user,
    verify_password,
    get_password_hash,
)
from .core.config import settings
from .core.storage import storage

app = FastAPI()

origins = [
    "http://localhost:5173",  # Frontend dev server
    "http://localhost:3000",  # Alternative dev port
    "http://127.0.0.1:5173",  # Frontend dev server alternative
    "http://127.0.0.1:8000",  # Backend server
    "https://crypto-real-estate-app-bff7pop1.devinapps.com",  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Expose all headers
)

# Mount static files directory for serving uploaded files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

models.user.Base.metadata.create_all(bind=engine)
models.property.Base.metadata.create_all(bind=engine)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/auth/register", response_model=schemas.user.User)
async def register(user: schemas.user.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    try:
        db_user = crud.user.create_user(db=db, user=user)
        return db_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/auth/login", response_model=Dict[str, str])
async def login(
    form_data: schemas.user.UserLogin,
    db: Session = Depends(get_db)
):
    user = crud.user.get_user_by_email(db, email=form_data.email)
    if not user or not crud.user.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.user.User)
def create_user(user: schemas.user.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.user.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.user.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.user.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/me", response_model=schemas.user.User)
def get_current_user_info(current_user: models.user.User = Depends(get_current_user)):
    return current_user

@app.post("/properties/", response_model=schemas.property.Property)
def create_property(
    property: schemas.property.PropertyCreate,
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return crud.property.create_property(db=db, property=property, owner_id=current_user.id)
    except Exception as e:
        print(f"Error in create_property: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating property: {str(e)}"
        )

@app.get("/properties/", response_model=List[schemas.property.Property])
def read_properties(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        properties = crud.property.get_properties(db, skip=skip, limit=limit)
        # Ensure photos field is initialized for each property
        for prop in properties:
            if prop.photos is None:
                prop.photos = []
        return properties
    except Exception as e:
        print(f"Error in read_properties: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching properties: {str(e)}"
        )

@app.get("/users/{user_id}/properties/", response_model=List[schemas.property.Property])
def read_user_properties(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    properties = crud.property.get_user_properties(db, owner_id=user_id, skip=skip, limit=limit)
    return properties

@app.get("/properties/my/", response_model=List[schemas.property.Property])
def get_my_properties(
    current_user: models.user.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.property.get_user_properties(db, owner_id=current_user.id, skip=skip, limit=limit)

@app.get("/properties/search/", response_model=List[schemas.property.Property])
def search_properties(
    query: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    location: Optional[str] = None,
    currency: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.property.search_properties(
        db, query, min_price, max_price, bedrooms, location, currency, skip, limit
    )

@app.post("/properties/{property_id}/photos/", response_model=schemas.property.Property)
async def upload_property_photos(
    property_id: int,
    files: List[UploadFile] = File(...),
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    property_item = crud.property.get_property(db, property_id=property_id)
    if not property_item:
        raise HTTPException(status_code=404, detail="Property not found")
    if property_item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this property")

    try:
        photo_urls = await storage.save_files(files, property_id)
        property_item.photos.extend(photo_urls)
        if not property_item.main_photo and photo_urls:
            property_item.main_photo = photo_urls[0]

        db.commit()
        db.refresh(property_item)
        return property_item
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/properties/{property_id}/main-photo/", response_model=schemas.property.Property)
async def set_main_photo(
    property_id: int,
    photo_url: str,
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    property_item = crud.property.get_property(db, property_id=property_id)
    if not property_item:
        raise HTTPException(status_code=404, detail="Property not found")
    if property_item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this property")

    if photo_url not in property_item.photos:
        raise HTTPException(status_code=400, detail="Photo URL not found in property's photos")

    property_item.main_photo = photo_url
    db.commit()
    db.refresh(property_item)
    return property_item
