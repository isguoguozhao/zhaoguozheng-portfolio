from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./portfolio.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

from .image import Image
from .card_style import CardStyle
from .project_category import ProjectCategory
from .project import Project
from .experience import Experience
from .skill import SkillCategory, Skill
from .social_link import SocialLink
from .admin_user import AdminUser

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
