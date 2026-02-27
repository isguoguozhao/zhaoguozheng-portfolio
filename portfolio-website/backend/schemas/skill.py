from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Skill Category Schemas
class SkillCategoryBase(BaseModel):
    name: str
    sort_order: int = 0

class SkillCategoryCreate(SkillCategoryBase):
    pass

class SkillCategoryUpdate(BaseModel):
    name: Optional[str] = None
    sort_order: Optional[int] = None

class SkillCategoryResponse(SkillCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    skills: List['SkillResponse'] = []

    class Config:
        from_attributes = True

# Skill Schemas
class SkillBase(BaseModel):
    category_id: int
    name: str
    level: int = 0
    sort_order: int = 0

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    level: Optional[int] = None
    sort_order: Optional[int] = None

class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Update forward reference
SkillCategoryResponse.model_rebuild()
