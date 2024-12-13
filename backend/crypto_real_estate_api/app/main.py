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
from .models import user, property, profiles
from .schemas import user as user_schemas
from .schemas import property as property_schemas
from .schemas import profiles as profile_schemas
from .crud import user as user_crud
from .crud import property as property_crud
from .crud import profiles as profile_crud
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

@app.post("/api/register", response_model=user_schemas.User)
async def register(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user directly through crud function without pre-hashing
    db_user = user_crud.create_user(
        db=db,
        user=user  # Pass the UserCreate object directly
    )
    return db_user

@app.post("/api/login", response_model=user_schemas.Token)
async def login(
    form_data: user_schemas.UserLogin = None,
    db: Session = Depends(get_db)
):
    # Get credentials from JSON body
    email = form_data.email
    password = form_data.password

    user = user_crud.get_user_by_email(db, email=email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(data={"sub": user.email}, user=user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "profile_type": user.profile_type.value
    }

@app.post("/api/users/", response_model=schemas.user.User)
def create_user(user: schemas.user.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.user.create_user(db=db, user=user)

@app.get("/api/users/", response_model=List[schemas.user.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = user_crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/api/users/me", response_model=schemas.user.User)
def get_current_user_info(current_user: models.user.User = Depends(get_current_user)):
    return current_user

@app.post("/api/properties/", response_model=property_schemas.Property)
def create_property(
    property: property_schemas.PropertyCreate,
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.profile_type not in [models.user.UserProfileType.SELLER, models.user.UserProfileType.BOTH]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sellers can create properties"
        )
    try:
        return property_crud.create_property(db=db, property=property, owner_id=current_user.id)
    except Exception as e:
        print(f"Error in create_property: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating property: {str(e)}"
        )

@app.get("/api/properties/", response_model=List[property_schemas.Property])
def read_properties(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        properties = property_crud.get_properties(db, skip=skip, limit=limit)
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

@app.get("/api/users/{user_id}/properties/", response_model=List[property_schemas.Property])
def read_user_properties(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    properties = property_crud.get_user_properties(db, owner_id=user_id, skip=skip, limit=limit)
    return properties

@app.get("/api/properties/my/", response_model=List[property_schemas.Property])
def get_my_properties(
    current_user: models.user.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return property_crud.get_user_properties(db, owner_id=current_user.id, skip=skip, limit=limit)

@app.get("/api/properties/search/", response_model=List[property_schemas.Property])
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
    return property_crud.search_properties(
        db, query, min_price, max_price, bedrooms, location, currency, skip, limit
    )

@app.post("/api/properties/{property_id}/photos/", response_model=property_schemas.Property)
async def upload_property_photos(
    property_id: int,
    files: List[UploadFile] = File(...),
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    property_item = property_crud.get_property(db, property_id=property_id)
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

@app.put("/api/properties/{property_id}/main-photo/", response_model=property_schemas.Property)
async def set_main_photo(
    property_id: int,
    photo_url: str,
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    property_item = property_crud.get_property(db, property_id=property_id)
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

@app.post("/api/users/profile/buyer", response_model=profile_schemas.BuyerProfile)
async def create_buyer_profile(
    profile: profile_schemas.BuyerProfileCreate,
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.profile_type not in [models.user.UserProfileType.BUYER, models.user.UserProfileType.BOTH]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized to create a buyer profile"
        )

    existing_profile = profile_crud.get_buyer_profile(db, current_user.id)
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Buyer profile already exists"
        )

    return profile_crud.create_buyer_profile(db, current_user.id, profile)

@app.post("/api/users/profile/seller", response_model=profile_schemas.SellerProfile)
async def create_seller_profile(
    profile: profile_schemas.SellerProfileCreate,
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.profile_type not in [models.user.UserProfileType.SELLER, models.user.UserProfileType.BOTH]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized to create a seller profile"
        )

    existing_profile = profile_crud.get_seller_profile(db, current_user.id)
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seller profile already exists"
        )

    return profile_crud.create_seller_profile(db, current_user.id, profile)

@app.get("/api/users/profile/buyer", response_model=schemas.profiles.BuyerProfile)
async def get_buyer_profile(
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = crud.profiles.get_buyer_profile(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Buyer profile not found"
        )
    return profile

@app.get("/api/users/profile/seller", response_model=schemas.profiles.SellerProfile)
async def get_seller_profile(
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = crud.profiles.get_seller_profile(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seller profile not found"
        )
    return profile

@app.put("/api/users/profile/buyer", response_model=schemas.profiles.BuyerProfile)
async def update_buyer_profile(
    profile: schemas.profiles.BuyerProfileCreate,
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.profile_type not in [models.user.UserProfileType.BUYER, models.user.UserProfileType.BOTH]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized to update buyer profile"
        )

    updated_profile = crud.profiles.update_buyer_profile(db, current_user.id, profile)
    if not updated_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Buyer profile not found"
        )
    return updated_profile

@app.put("/api/users/profile/seller", response_model=schemas.profiles.SellerProfile)
async def update_seller_profile(
    profile: schemas.profiles.SellerProfileCreate,
    current_user: models.user.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.profile_type not in [models.user.UserProfileType.SELLER, models.user.UserProfileType.BOTH]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized to update seller profile"
        )

    updated_profile = crud.profiles.update_seller_profile(db, current_user.id, profile)
    if not updated_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seller profile not found"
        )
    return updated_profile
