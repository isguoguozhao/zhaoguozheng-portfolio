from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from . import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("project_categories.id"), nullable=False)
    description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    thumbnail_id = Column(Integer, ForeignKey("images.id"), nullable=True)
    image_ids = Column(JSON, default=list)  # List of image IDs
    technologies = Column(JSON, default=list)  # List of technology strings
    role = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    achievements = Column(JSON, default=list)  # List of achievement strings
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Integer, default=1)  # 1 = active, 0 = inactive
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
