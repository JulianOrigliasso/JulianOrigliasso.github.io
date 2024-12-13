from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, ARRAY
from sqlalchemy.orm import relationship
import enum
from ..core.database import Base

class CryptoCurrency(str, enum.Enum):
    BTC = "BTC"
    ETH = "ETH"
    USDC = "USDC"

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    currency_type = Column(Enum(CryptoCurrency))  # Renamed from currency to currency_type
    location = Column(String)
    bedrooms = Column(Integer)
    bathrooms = Column(Float)
    square_feet = Column(Float)  # Renamed from area to square_feet
    photos = Column(ARRAY(String), default=[])  # Added photos field
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Relationship
    owner = relationship("User", back_populates="properties")
