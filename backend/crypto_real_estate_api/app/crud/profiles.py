from sqlalchemy.orm import Session
from app.models.profiles import Profile
from app.schemas.profiles import ProfileCreate

def create_profile(db: Session, profile: ProfileCreate, user_id: int):
    db_profile = Profile(profile_type=profile.profile_type, user_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def get_profile_by_user_id(db: Session, user_id: int):
    return db.query(Profile).filter(Profile.user_id == user_id).first()

def update_profile(db: Session, profile_id: int, profile_type: str):
    db_profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if db_profile:
        db_profile.profile_type = profile_type
        db.commit()
        db.refresh(db_profile)
    return db_profile
