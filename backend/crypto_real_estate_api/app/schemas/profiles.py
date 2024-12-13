from pydantic import BaseModel, Field
from typing import Optional
from ..models.profiles import VerificationStatus

class SellerProfileBase(BaseModel):
    verification_status: VerificationStatus = VerificationStatus.PENDING
    rating: float = Field(default=0.0, ge=0.0, le=5.0)
    total_listings: int = Field(default=0, ge=0)

class SellerProfileCreate(SellerProfileBase):
    pass

class SellerProfile(SellerProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class BuyerProfileBase(BaseModel):
    preferred_location: Optional[str] = None
    max_budget: Optional[float] = Field(default=None, ge=0.0)

class BuyerProfileCreate(BuyerProfileBase):
    pass

class BuyerProfile(BuyerProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
