from sqlalchemy.orm import Session
from ..models.user import User, UserProfileType
from ..schemas.user import UserCreate
from ..core.auth import get_password_hash, verify_password

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    if not user.password:
        raise ValueError("Password is required for user registration")

    db_user = User(
        email=user.email,
        wallet_address=user.wallet_address,
        name=user.name,
        profile_type=user.profile_type,
        hashed_password=get_password_hash(user.password),
        is_active=True
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise e
