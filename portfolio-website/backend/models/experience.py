from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from . import Base

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)  # 'education' or 'work'
    title = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    location = Column(String, nullable=True)
    start_date = Column(String, nullable=False)  # Format: "YYYY-MM" or "YYYY年MM月"
    end_date = Column(String, nullable=True)     # Format: "YYYY-MM" or "YYYY年MM月" or "至今"
    description = Column(Text, nullable=True)
    highlights = Column(JSON, default=list)  # List of highlight strings
    image_id = Column(Integer, ForeignKey("images.id"), nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
