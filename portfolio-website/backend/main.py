from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import uvicorn
import os
from pathlib import Path

# Environment configuration
RAILWAY_ENVIRONMENT = os.getenv("RAILWAY_ENVIRONMENT", "development")
PORT = int(os.getenv("PORT", "8000"))

# Database setup - use Railway volume path if available
if os.getenv("RAILWAY_VOLUME_MOUNT_PATH"):
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.getenv('RAILWAY_VOLUME_MOUNT_PATH')}/portfolio.db"
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./portfolio.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings - use environment variable in production
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Models
class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProjectCategory(Base):
    __tablename__ = "project_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("project_categories.id"))
    description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    technologies = Column(JSON, default=list)
    role = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    achievements = Column(JSON, default=list)
    sort_order = Column(Integer, default=0)

class Experience(Base):
    __tablename__ = "experiences"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)  # 'education' or 'work'
    title = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    location = Column(String, nullable=True)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    highlights = Column(JSON, default=list)
    image_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)

class SkillCategory(Base):
    __tablename__ = "skill_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    sort_order = Column(Integer, default=0)
    skills = relationship("Skill", back_populates="category", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("skill_categories.id"))
    name = Column(String, nullable=False)
    level = Column(Integer, default=0)
    sort_order = Column(Integer, default=0)
    category = relationship("SkillCategory", back_populates="skills")

class SocialLink(Base):
    __tablename__ = "social_links"
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)
    icon_type = Column(String, nullable=False)
    url = Column(String, nullable=False)
    label = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)

class Profile(Base):
    __tablename__ = "profile"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)
    bio = Column(Text, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    location = Column(String, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="Portfolio Admin API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(AdminUser).filter(AdminUser.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class ProjectCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    sort_order: int = 0

class ProjectCategoryResponse(ProjectCategoryCreate):
    id: int
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    category_id: int
    description: str
    full_description: Optional[str] = None
    image_url: Optional[str] = None
    technologies: List[str] = []
    role: str
    duration: str
    achievements: List[str] = []
    sort_order: int = 0

class ProjectResponse(ProjectCreate):
    id: int
    class Config:
        from_attributes = True

class ExperienceCreate(BaseModel):
    type: str
    title: str
    organization: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None
    highlights: List[str] = []
    image_url: Optional[str] = None
    sort_order: int = 0

class ExperienceResponse(ExperienceCreate):
    id: int
    class Config:
        from_attributes = True

class SkillCategoryCreate(BaseModel):
    name: str
    sort_order: int = 0

class SkillCreate(BaseModel):
    category_id: int
    name: str
    level: int = 0
    sort_order: int = 0

class SkillResponse(SkillCreate):
    id: int
    class Config:
        from_attributes = True

class SkillCategoryResponse(SkillCategoryCreate):
    id: int
    skills: List[SkillResponse] = []
    class Config:
        from_attributes = True

class SocialLinkCreate(BaseModel):
    platform: str
    icon_type: str
    url: str
    label: Optional[str] = None
    sort_order: int = 0

class SocialLinkResponse(SocialLinkCreate):
    id: int
    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class ProfileResponse(ProfileUpdate):
    id: int
    class Config:
        from_attributes = True

# Routes
@app.get("/")
async def root():
    return {"message": "Portfolio Admin API", "version": "1.0.0"}

# Admin Auth
@app.post("/api/admin/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/admin/setup")
async def setup_admin(db: Session = Depends(get_db)):
    """Create default admin user"""
    existing = db.query(AdminUser).filter(AdminUser.username == "admin").first()
    if existing:
        return {"message": "Admin already exists"}
    
    admin = AdminUser(
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("admin123")
    )
    db.add(admin)
    db.commit()
    return {"message": "Admin created", "username": "admin", "password": "admin123"}

# Images
@app.post("/api/images/upload")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Save file
    ext = Path(file.filename).suffix
    filename = f"{datetime.utcnow().timestamp()}{ext}"
    filepath = UPLOAD_DIR / filename
    with open(filepath, "wb") as f:
        f.write(content)
    
    # Save to DB
    image = Image(filename=filename, url=f"/uploads/{filename}")
    db.add(image)
    db.commit()
    db.refresh(image)
    return {"id": image.id, "url": image.url, "filename": filename}

@app.get("/api/images")
async def list_images(db: Session = Depends(get_db)):
    return db.query(Image).order_by(Image.created_at.desc()).all()

@app.delete("/api/images/{image_id}")
async def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete file
    filepath = UPLOAD_DIR / image.filename
    if filepath.exists():
        filepath.unlink()
    
    db.delete(image)
    db.commit()
    return {"message": "Image deleted"}

# Project Categories
@app.get("/api/project-categories", response_model=List[ProjectCategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    return db.query(ProjectCategory).order_by(ProjectCategory.sort_order).all()

@app.post("/api/project-categories", response_model=ProjectCategoryResponse)
async def create_category(
    category: ProjectCategoryCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_category = ProjectCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.put("/api/project-categories/{category_id}", response_model=ProjectCategoryResponse)
async def update_category(
    category_id: int,
    category: ProjectCategoryCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_category = db.query(ProjectCategory).filter(ProjectCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/api/project-categories/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_category = db.query(ProjectCategory).filter(ProjectCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted"}

# Projects
@app.get("/api/projects", response_model=List[ProjectResponse])
async def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.sort_order).all()

@app.post("/api/projects", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/api/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for key, value in project.dict().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/api/projects/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted"}

# Experiences
@app.get("/api/experiences", response_model=List[ExperienceResponse])
async def get_experiences(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.sort_order).all()

@app.post("/api/experiences", response_model=ExperienceResponse)
async def create_experience(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_experience = Experience(**experience.dict())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@app.put("/api/experiences/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: int,
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    for key, value in experience.dict().items():
        setattr(db_experience, key, value)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@app.delete("/api/experiences/{experience_id}")
async def delete_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    db.delete(db_experience)
    db.commit()
    return {"message": "Experience deleted"}

# Skills
@app.get("/api/skill-categories", response_model=List[SkillCategoryResponse])
async def get_skill_categories(db: Session = Depends(get_db)):
    return db.query(SkillCategory).order_by(SkillCategory.sort_order).all()

@app.post("/api/skill-categories", response_model=SkillCategoryResponse)
async def create_skill_category(
    category: SkillCategoryCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_category = SkillCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/api/skill-categories/{category_id}")
async def delete_skill_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_category = db.query(SkillCategory).filter(SkillCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted"}

@app.post("/api/skills", response_model=SkillResponse)
async def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.put("/api/skills/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    skill: SkillCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    for key, value in skill.dict().items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.delete("/api/skills/{skill_id}")
async def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted"}

# Social Links
@app.get("/api/social-links", response_model=List[SocialLinkResponse])
async def get_social_links(db: Session = Depends(get_db)):
    return db.query(SocialLink).order_by(SocialLink.sort_order).all()

@app.post("/api/social-links", response_model=SocialLinkResponse)
async def create_social_link(
    link: SocialLinkCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_link = SocialLink(**link.dict())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@app.put("/api/social-links/{link_id}", response_model=SocialLinkResponse)
async def update_social_link(
    link_id: int,
    link: SocialLinkCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Social link not found")
    
    for key, value in link.dict().items():
        setattr(db_link, key, value)
    db.commit()
    db.refresh(db_link)
    return db_link

@app.delete("/api/social-links/{link_id}")
async def delete_social_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Social link not found")
    
    db.delete(db_link)
    db.commit()
    return {"message": "Social link deleted"}

# Profile
@app.get("/api/profile", response_model=ProfileResponse)
async def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        # Create default profile
        profile = Profile(
            name="赵国政",
            title="信息管理与信息系统",
            subtitle="全栈开发工程师 / 数据分析师",
            bio="成都东软学院信息管理与信息系统专业大三在读学生...",
            email="g3258968947@outlook.com",
            phone="+86 152-3424-0469",
            location="成都市"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@app.put("/api/profile", response_model=ProfileResponse)
async def update_profile(
    profile: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    db_profile = db.query(Profile).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile.dict(exclude_unset=True).items():
        if value is not None:
            setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.on_event("startup")
async def startup_event():
    """应用启动时执行数据初始化"""
    from init_data import init_database
    init_database()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
