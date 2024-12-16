from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.transaction import TransactionStatus
from ..models.property import CryptoCurrency

class TransactionBase(BaseModel):
    property_id: int
    amount: float
    currency: CryptoCurrency

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    buyer_id: int
    status: TransactionStatus
    transaction_hash: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
