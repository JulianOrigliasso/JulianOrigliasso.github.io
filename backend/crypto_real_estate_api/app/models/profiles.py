from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum

class VerificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"

class SellerProfile(Base):
    __tablename__ = "seller_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    verification_status = Column(Enum(VerificationStatus), nullable=False, default=VerificationStatus.PENDING)
    rating = Column(Float, default=0.0)
    total_listings = Column(Integer, default=0)

    # Relationships
    user = relationship("User", back_populates="seller_profile")

class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    preferred_location = Column(String, nullable=True)
    max_budget = Column(Float, nullable=True)

    # Relationships
    user = relationship("User", back_populates="buyer_profile")
