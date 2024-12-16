from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from ..models.property import CryptoCurrency, PaymentStatus

class PropertyBase(BaseModel):
    title: str
    description: str
    price: float = Field(gt=0)
    currency: CryptoCurrency
    location: str
    bedrooms: int = Field(ge=0)
    bathrooms: int = Field(ge=0)
    area: float = Field(gt=0)

class PropertyCreate(PropertyBase):
    pass

class PropertyResponse(PropertyBase):
    id: int
    owner_id: int
    payment_status: PaymentStatus = PaymentStatus.AVAILABLE
    payment_address: Optional[str] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    currency: Optional[CryptoCurrency] = None
    location: Optional[str] = None
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    area: Optional[float] = Field(None, gt=0)
