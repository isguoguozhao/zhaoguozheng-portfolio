from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SocialLinkBase(BaseModel):
    platform: str
    icon_type: str
    url: str
    label: Optional[str] = None
    sort_order: int = 0
    is_active: int = 1

class SocialLinkCreate(SocialLinkBase):
    pass

class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    icon_type: Optional[str] = None
    url: Optional[str] = None
    label: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[int] = None

class SocialLinkResponse(SocialLinkBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
