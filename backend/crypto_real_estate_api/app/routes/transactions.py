from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.transaction import Transaction, TransactionStatus
from ..models.property import Property, PaymentStatus
from ..schemas.transaction import TransactionCreate, Transaction as TransactionSchema
from ..core.security import get_current_user
from ..models.user import User

router = APIRouter()

@router.post("/", response_model=TransactionSchema)
async def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if property exists and is available
    property = db.query(Property).filter(Property.id == transaction.property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    if property.payment_status != PaymentStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Property is not available for purchase")

    # Create transaction
    db_transaction = Transaction(
        **transaction.dict(),
        buyer_id=current_user.id,
    )

    # Update property status
    property.payment_status = PaymentStatus.PENDING

    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/user", response_model=List[TransactionSchema])
async def get_user_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(
        Transaction.buyer_id == current_user.id
    ).all()
    return transactions

@router.get("/property/{property_id}", response_model=List[TransactionSchema])
async def get_property_transactions(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user owns the property
    property = db.query(Property).filter(
        Property.id == property_id,
        Property.owner_id == current_user.id
    ).first()
    if not property:
        raise HTTPException(
            status_code=404,
            detail="Property not found or you don't have permission to view its transactions"
        )

    transactions = db.query(Transaction).filter(
        Transaction.property_id == property_id
    ).all()
    return transactions
