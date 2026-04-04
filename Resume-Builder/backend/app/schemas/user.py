from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# User creation schema
class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)


# User login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# User update schema
class UserUpdate(BaseModel):
    name: Optional[str] = None


# User response schema
class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    plan: str
    downloads_used: int
    downloads_limit: int
    stripe_customer_id: Optional[str]
    stripe_subscription_id: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None
