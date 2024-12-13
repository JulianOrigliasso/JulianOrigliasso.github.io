from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from ..models.property import Property
from ..schemas.property import PropertyCreate

def get_property(db: Session, property_id: int):
    return db.query(Property).filter(Property.id == property_id).first()

def get_properties(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Property).options(joinedload(Property.owner)).offset(skip).limit(limit).all()

def create_property(db: Session, property: PropertyCreate, owner_id: int):
    try:
        property_data = property.model_dump()
        db_property = Property(**property_data, owner_id=owner_id)
        db.add(db_property)
        db.commit()
        db.refresh(db_property)
        return db_property
    except Exception as e:
        db.rollback()
        raise Exception(f"Database error: {str(e)}")

def get_user_properties(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    return db.query(Property).options(joinedload(Property.owner)).filter(Property.owner_id == owner_id).offset(skip).limit(limit).all()

def search_properties(
    db: Session,
    query: str = None,
    min_price: float = None,
    max_price: float = None,
    bedrooms: int = None,
    location: str = None,
    currency: str = None,
    skip: int = 0,
    limit: int = 100
):
    properties = db.query(Property).options(joinedload(Property.owner))

    if query:
        properties = properties.filter(
            or_(
                Property.title.ilike(f"%{query}%"),
                Property.description.ilike(f"%{query}%")
            )
        )
    if min_price is not None:
        properties = properties.filter(Property.price >= min_price)
    if max_price is not None:
        properties = properties.filter(Property.price <= max_price)
    if bedrooms:
        properties = properties.filter(Property.bedrooms == bedrooms)
    if location:
        properties = properties.filter(Property.location.ilike(f"%{location}%"))
    if currency:
        properties = properties.filter(Property.currency == currency)

    return properties.offset(skip).limit(limit).all()
