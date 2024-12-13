from pydantic import BaseModel, Field
from typing import Optional, List
from ..models.property import CryptoCurrency
from .user import User

class PropertyBase(BaseModel):
    title: str
    description: str
    price: float
    currency_type: CryptoCurrency  # Changed from currency to currency_type
    location: str
    bedrooms: int
    bathrooms: float
    square_feet: float  # Changed from area to square_feet
    photos: List[str] = []

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: int
    owner_id: int
    owner: Optional[User] = None  # Made owner optional to avoid circular dependency issues

    class Config:
        from_attributes = True
