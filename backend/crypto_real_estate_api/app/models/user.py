from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    wallet_address = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)

    properties = relationship("Property", back_populates="owner")
