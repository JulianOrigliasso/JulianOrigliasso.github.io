from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging
from ..core.database import get_db
from ..models.property import Property
from ..schemas.property import PropertyCreate, PropertyResponse, PropertyUpdate
from ..core.security import get_current_user
from ..models.user import User

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.debug(f"Creating property with data: {property_data}")
        logger.debug(f"Current user: {current_user.id}")

        property_dict = property_data.model_dump()
        logger.debug(f"Property dict: {property_dict}")

        db_property = Property(
            **property_dict,
            owner_id=current_user.id
        )
        logger.debug(f"Created property object: {db_property.__dict__}")

        db.add(db_property)
        db.commit()
        db.refresh(db_property)
        return db_property
    except Exception as e:
        logger.error(f"Error creating property: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=List[PropertyResponse])
async def list_properties(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    properties = db.query(Property).offset(skip).limit(limit).all()
    return properties

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: int,
    db: Session = Depends(get_db)
):
    property = db.query(Property).filter(Property.id == property_id).first()
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return property
