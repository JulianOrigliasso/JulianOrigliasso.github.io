from pydantic import BaseModel
from enum import Enum

class ProfileType(str, Enum):
    BUYER = "BUYER"
    SELLER = "SELLER"
    BOTH = "BOTH"

class ProfileBase(BaseModel):
    profile_type: ProfileType

class ProfileCreate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
