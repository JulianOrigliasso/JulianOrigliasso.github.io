from pydantic import BaseModel, EmailStr, constr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    wallet_address: str
    name: Optional[str] = None

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
