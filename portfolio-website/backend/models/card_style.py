from sqlalchemy import Column, Integer, String, Float, ForeignKey
from . import Base

class CardStyle(Base):
    __tablename__ = "card_styles"

    id = Column(Integer, primary_key=True, index=True)
    target_type = Column(String, nullable=False)  # 'hero', 'project', 'experience', 'skill', etc.
    target_id = Column(Integer, nullable=True)    # specific item id if applicable
    width = Column(Integer, nullable=True)        # in pixels
    height = Column(Integer, nullable=True)       # in pixels
    rotation = Column(Float, default=0)           # in degrees
    image_id = Column(Integer, ForeignKey("images.id"), nullable=True)
    custom_css = Column(String, nullable=True)    # additional custom CSS
