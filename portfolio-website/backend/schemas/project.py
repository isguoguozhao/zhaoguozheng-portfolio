from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ProjectBase(BaseModel):
    title: str
    category_id: int
    description: str
    full_description: Optional[str] = None
    thumbnail_id: Optional[int] = None
    image_ids: List[int] = []
    technologies: List[str] = []
    role: str
    duration: str
    achievements: List[str] = []
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    sort_order: int = 0
    is_active: int = 1

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    thumbnail_id: Optional[int] = None
    image_ids: Optional[List[int]] = None
    technologies: Optional[List[str]] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    achievements: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[int] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    category_name: Optional[str] = None
    thumbnail_url: Optional[str] = None
