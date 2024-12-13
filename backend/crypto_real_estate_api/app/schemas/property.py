from pydantic import BaseModel, Field
from typing import Optional, List
from ..models.property import CryptoCurrency
from .user import User

class PropertyBase(BaseModel):
    title: str
    description: str
    price: float
    currency: CryptoCurrency
    location: str
    bedrooms: int
    bathrooms: float
    area: float
    photos: List[str] = []
    main_photo: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: int
    owner_id: int
    owner: User

    class Config:
        from_attributes = True
