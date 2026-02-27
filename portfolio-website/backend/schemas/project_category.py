from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProjectCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    sort_order: int = 0

class ProjectCategoryCreate(ProjectCategoryBase):
    pass

class ProjectCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None

class ProjectCategoryResponse(ProjectCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
