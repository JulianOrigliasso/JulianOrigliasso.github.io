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
    currency = Column(Enum(CryptoCurrency))
    location = Column(String)
    bedrooms = Column(Integer)
    bathrooms = Column(Float)
    area = Column(Float)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Photo fields
    photos = Column(ARRAY(String), default=list)  # Array of photo URLs/paths
    main_photo = Column(String, nullable=True)    # Main display photo URL/path

    owner = relationship("User", back_populates="properties")
