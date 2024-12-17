from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base
from .property import CryptoCurrency, PaymentStatus

class TransactionStatus(str, enum.Enum):
    INITIATED = "INITIATED"
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    FAILED = "FAILED"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    buyer_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    currency = Column(String(10))  # Changed from Enum to String for MySQL compatibility
    transaction_hash = Column(String(255), nullable=True)  # Blockchain transaction hash
    status = Column(String(10), default=TransactionStatus.INITIATED.value)  # Changed from Enum to String
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    property = relationship("Property", back_populates="transactions")
    buyer = relationship("User")
