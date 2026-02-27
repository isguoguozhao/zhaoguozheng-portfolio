from pydantic import BaseModel
from typing import Optional

class CardStyleBase(BaseModel):
    target_type: str
    target_id: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    rotation: float = 0
    image_id: Optional[int] = None
    custom_css: Optional[str] = None

class CardStyleCreate(CardStyleBase):
    pass

class CardStyleUpdate(BaseModel):
    target_type: Optional[str] = None
    target_id: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    rotation: Optional[float] = None
    image_id: Optional[int] = None
    custom_css: Optional[str] = None

class CardStyleResponse(CardStyleBase):
    id: int

    class Config:
        from_attributes = True
