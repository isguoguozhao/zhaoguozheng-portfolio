from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from . import Base

class SocialLink(Base):
    __tablename__ = "social_links"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)  # 'github', 'linkedin', 'wechat', 'email', etc.
    icon_type = Column(String, nullable=False)  # Icon identifier for frontend
    url = Column(String, nullable=False)
    label = Column(String, nullable=True)  # Display label
    sort_order = Column(Integer, default=0)
    is_active = Column(Integer, default=1)  # 1 = active, 0 = inactive
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
