from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)  # Standard length for email addresses
    full_name = Column(String(100))  # Reasonable length for full names
    hashed_password = Column(String(255))  # Sufficient length for password hashes
    is_active = Column(Boolean, default=True)

    properties = relationship("Property", back_populates="owner")
    transactions = relationship("Transaction", back_populates="buyer")
