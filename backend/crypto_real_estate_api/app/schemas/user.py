from pydantic import BaseModel, EmailStr, constr
from typing import Optional, Literal
from ..models.user import UserProfileType

class UserBase(BaseModel):
    email: EmailStr
    wallet_address: str
    name: Optional[str] = None
    profile_type: Literal[UserProfileType.BUYER, UserProfileType.SELLER, UserProfileType.BOTH] = UserProfileType.BUYER

class UserCreate(UserBase):
    password: constr(min_length=8)  # Require minimum 8 characters for password

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    profile_type: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None
    profile_type: Optional[str] = None
