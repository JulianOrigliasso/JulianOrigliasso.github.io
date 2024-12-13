from enum import Enum
from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from app.core.database import Base

class ProfileType(str, Enum):
    BUYER = "BUYER"
    SELLER = "SELLER"
    BOTH = "BOTH"

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    profile_type = Column(SQLAlchemyEnum(ProfileType))

    # Relationships
    user = relationship("User", back_populates="profile")
    properties = relationship("Property", back_populates="seller")
