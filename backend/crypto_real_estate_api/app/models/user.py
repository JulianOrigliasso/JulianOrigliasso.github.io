from sqlalchemy import Boolean, Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum

class UserProfileType(str, enum.Enum):
    BUYER = "BUYER"
    SELLER = "SELLER"
    BOTH = "BOTH"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    wallet_address = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)

    profile_type = Column(Enum(UserProfileType), nullable=False, default=UserProfileType.BUYER)

    properties = relationship("Property", back_populates="owner")
    buyer_profile = relationship("BuyerProfile", back_populates="user", uselist=False)
    seller_profile = relationship("SellerProfile", back_populates="user", uselist=False)
