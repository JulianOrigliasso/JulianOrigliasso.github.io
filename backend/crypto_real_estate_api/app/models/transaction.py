from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, DateTime
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
    currency = Column(Enum(CryptoCurrency))
    transaction_hash = Column(String, nullable=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.INITIATED)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    property = relationship("Property", back_populates="transactions")
    buyer = relationship("User")
