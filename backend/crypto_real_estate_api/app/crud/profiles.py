from sqlalchemy.orm import Session
from ..models.profiles import BuyerProfile, SellerProfile
from ..schemas.profiles import BuyerProfileCreate, SellerProfileCreate
from ..models.user import UserProfileType

def create_buyer_profile(db: Session, user_id: int, profile: BuyerProfileCreate) -> BuyerProfile:
    db_profile = BuyerProfile(
        user_id=user_id,
        preferred_location=profile.preferred_location,
        max_budget=profile.max_budget
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def create_seller_profile(db: Session, user_id: int, profile: SellerProfileCreate) -> SellerProfile:
    db_profile = SellerProfile(
        user_id=user_id,
        verification_status=profile.verification_status,
        rating=profile.rating,
        total_listings=profile.total_listings
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def get_buyer_profile(db: Session, user_id: int) -> BuyerProfile:
    return db.query(BuyerProfile).filter(BuyerProfile.user_id == user_id).first()

def get_seller_profile(db: Session, user_id: int) -> SellerProfile:
    return db.query(SellerProfile).filter(SellerProfile.user_id == user_id).first()

def update_buyer_profile(db: Session, user_id: int, profile: BuyerProfileCreate) -> BuyerProfile:
    db_profile = get_buyer_profile(db, user_id)
    if db_profile:
        for key, value in profile.dict(exclude_unset=True).items():
            setattr(db_profile, key, value)
        db.commit()
        db.refresh(db_profile)
    return db_profile

def update_seller_profile(db: Session, user_id: int, profile: SellerProfileCreate) -> SellerProfile:
    db_profile = get_seller_profile(db, user_id)
    if db_profile:
        for key, value in profile.dict(exclude_unset=True).items():
            setattr(db_profile, key, value)
        db.commit()
        db.refresh(db_profile)
    return db_profile
