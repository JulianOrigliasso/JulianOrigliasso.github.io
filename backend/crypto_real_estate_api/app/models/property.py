from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, DateTime
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
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    currency = Column(Enum(CryptoCurrency))
    location = Column(String)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    area = Column(Float)  # in square meters
    owner_id = Column(Integer, ForeignKey("users.id"))
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.AVAILABLE)
    payment_address = Column(String, nullable=True)  # Crypto wallet address for payment
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="properties")
    transactions = relationship("Transaction", back_populates="property")
