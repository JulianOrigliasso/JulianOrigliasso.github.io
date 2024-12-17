from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from ..core.database import Base

class CryptoCurrency(str, enum.Enum):
    BTC = "BTC"
    ETH = "ETH"
    USDC = "USDC"

class PaymentStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)  # Reasonable length for property titles
    description = Column(String(2000))  # Long text for property descriptions
    price = Column(Float)
    currency = Column(String(10))  # Changed from Enum to String for MySQL compatibility
    location = Column(String(255))  # Sufficient for addresses
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    area = Column(Float)  # in square meters
    owner_id = Column(Integer, ForeignKey("users.id"))
    payment_status = Column(String(10), default=PaymentStatus.AVAILABLE.value)
    payment_address = Column(String(255), nullable=True)  # Crypto wallet address
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="properties")
    transactions = relationship("Transaction", back_populates="property")
