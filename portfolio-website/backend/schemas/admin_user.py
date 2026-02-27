from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AdminUserBase(BaseModel):
    username: str
    email: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False

class AdminUserCreate(AdminUserBase):
    password: str

class AdminUserResponse(AdminUserBase):
    id: int
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
