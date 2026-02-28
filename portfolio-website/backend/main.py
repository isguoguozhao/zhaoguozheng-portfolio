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

# User System Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    points = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VisitLog(Base):
    __tablename__ = "visit_logs"
    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    visited_at = Column(DateTime, default=datetime.utcnow)

class EmailVerification(Base):
    __tablename__ = "email_verifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    email = Column(String, nullable=False)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class CheckIn(Base):
    __tablename__ = "checkins"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    check_in_date = Column(DateTime, nullable=False)
    points_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class PointsLog(Base):
    __tablename__ = "points_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

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

# User System Schemas
class UserRegister(BaseModel):
    username: str
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    avatar: Optional[str] = None
    points: int
    created_at: datetime
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    avatar: Optional[str] = None

class EmailBindRequest(BaseModel):
    email: str

class EmailVerifyRequest(BaseModel):
    code: str

class CheckInResponse(BaseModel):
    success: bool
    points_earned: int
    message: str
    total_points: int

class CheckInStatus(BaseModel):
    has_checked_in_today: bool
    last_check_in_date: Optional[datetime] = None

class PointsLogResponse(BaseModel):
    id: int
    points: int
    reason: str
    created_at: datetime
    class Config:
        from_attributes = True

class VisitStats(BaseModel):
    total_visits: int

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

# User Auth Dependency
async def get_current_user_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# User System Routes
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Validate passwords match
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Validate password length
    if len(user_data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # Check if username exists
    existing = db.query(User).filter(User.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create user
    user = User(
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        points=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# 兼容前端的 API 路径
@app.post("/api/users/register")
async def register_compat(
    request: Request,
    db: Session = Depends(get_db)
):
    """兼容前端表单格式的注册"""
    body = await request.json()
    username = body.get("username")
    password = body.get("password")
    confirm_password = body.get("confirm_password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    existing = db.query(User).filter(User.username == username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    user = User(
        username=username,
        hashed_password=get_password_hash(password),
        points=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"user_id": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@app.post("/api/auth/login")
async def user_login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(data={"user_id": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

# 兼容前端的 API 路径
@app.post("/api/users/login")
async def user_login_compat(
    request: Request,
    db: Session = Depends(get_db)
):
    """兼容前端表单格式的登录"""
    body = await request.json()
    username = body.get("username")
    password = body.get("password")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(data={"user_id": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@app.get("/api/user/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user_user)):
    return current_user

# 兼容前端的 API 路径
@app.get("/api/users/me", response_model=UserResponse)
async def get_user_profile_compat(current_user: User = Depends(get_current_user_user)):
    return current_user

@app.put("/api/user/profile", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    if profile_data.username and profile_data.username != current_user.username:
        existing = db.query(User).filter(User.username == profile_data.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        current_user.username = profile_data.username

    if profile_data.avatar:
        current_user.avatar = profile_data.avatar

    db.commit()
    db.refresh(current_user)
    return current_user

# 兼容前端的 API 路径
@app.put("/api/users/me", response_model=UserResponse)
async def update_user_profile_compat(
    request: Request,
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    body = await request.json()
    username = body.get("username")
    avatar = body.get("avatar")

    if username and username != current_user.username:
        existing = db.query(User).filter(User.username == username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        current_user.username = username

    if avatar:
        current_user.avatar = avatar

    db.commit()
    db.refresh(current_user)
    return current_user

@app.post("/api/user/avatar")
async def upload_user_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:  # 5MB limit for avatars
        raise HTTPException(status_code=400, detail="File too large")
    
    # Save file
    ext = Path(file.filename).suffix
    filename = f"avatar_{current_user.id}_{int(datetime.utcnow().timestamp())}{ext}"
    filepath = UPLOAD_DIR / filename
    with open(filepath, "wb") as f:
        f.write(content)
    
    # Update user avatar
    current_user.avatar = f"/uploads/{filename}"
    db.commit()

    return {"avatar_url": current_user.avatar}

# 兼容前端的 API 路径
@app.post("/api/users/avatar")
async def upload_user_avatar_compat(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:  # 5MB limit for avatars
        raise HTTPException(status_code=400, detail="File too large")

    # Save file
    ext = Path(file.filename).suffix
    filename = f"avatar_{current_user.id}_{int(datetime.utcnow().timestamp())}{ext}"
    filepath = UPLOAD_DIR / filename
    with open(filepath, "wb") as f:
        f.write(content)

    # Update user avatar
    current_user.avatar = f"/uploads/{filename}"
    db.commit()

    return {"avatar_url": current_user.avatar}

# Visit Stats
@app.post("/api/stats/visit")
async def record_visit(request: Request, db: Session = Depends(get_db)):
    visit = VisitLog(
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    db.add(visit)
    db.commit()
    return {"message": "Visit recorded"}

@app.get("/api/stats/visits", response_model=VisitStats)
async def get_visit_stats(db: Session = Depends(get_db)):
    total = db.query(VisitLog).count()
    return VisitStats(total_visits=total)

# 兼容前端的 API 路径
@app.get("/api/stats")
async def get_stats_compat(db: Session = Depends(get_db)):
    total = db.query(VisitLog).count()
    return {"total_visits": total, "today_visits": 0}

# Email Verification
import random
import string

@app.post("/api/email/send-code")
async def send_email_code(
    request: EmailBindRequest,
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    # Generate 6-digit alphanumeric code
    code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    
    # Save verification code
    verification = EmailVerification(
        user_id=current_user.id,
        email=request.email,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(verification)
    db.commit()
    
    # TODO: Send email with code
    # For now, return the code in response (for testing)
    return {
        "message": "Verification code sent",
        "code": code,  # Remove this in production
        "expires_in": "5 minutes"
    }

@app.post("/api/email/verify")
async def verify_email(
    request: EmailVerifyRequest,
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    # Find valid verification code
    verification = db.query(EmailVerification).filter(
        EmailVerification.user_id == current_user.id,
        EmailVerification.code == request.code,
        EmailVerification.expires_at > datetime.utcnow()
    ).order_by(EmailVerification.created_at.desc()).first()

    if not verification:
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    # Update user email
    current_user.email = verification.email
    db.commit()

    return {"message": "Email bound successfully", "email": current_user.email}

# 兼容前端的 API 路径
@app.post("/api/users/email/code")
async def send_email_code_compat(
    request: Request,
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    body = await request.json()
    email = body.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Email required")

    # Generate 6-digit alphanumeric code
    code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))

    # Save verification code
    verification = EmailVerification(
        user_id=current_user.id,
        email=email,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(verification)
    db.commit()

    return {
        "message": "Verification code sent",
        "code": code,
        "expires_in": "5 minutes"
    }

@app.post("/api/users/email/bind")
async def verify_email_compat(
    request: Request,
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    body = await request.json()
    email = body.get("email")
    code = body.get("code")

    if not email or not code:
        raise HTTPException(status_code=400, detail="Email and code required")

    # Find valid verification code
    verification = db.query(EmailVerification).filter(
        EmailVerification.user_id == current_user.id,
        EmailVerification.code == code,
        EmailVerification.expires_at > datetime.utcnow()
    ).order_by(EmailVerification.created_at.desc()).first()

    if not verification:
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    # Update user email
    current_user.email = email
    db.commit()

    return {"message": "Email bound successfully", "email": current_user.email}

# Check-in System
@app.post("/api/checkin", response_model=CheckInResponse)
async def check_in(
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    from datetime import date
    
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    # Check if already checked in today
    existing = db.query(CheckIn).filter(
        CheckIn.user_id == current_user.id,
        CheckIn.check_in_date >= today_start,
        CheckIn.check_in_date <= today_end
    ).first()
    
    if existing:
        return CheckInResponse(
            success=False,
            points_earned=0,
            message="Already checked in today, come back tomorrow",
            total_points=current_user.points
        )
    
    # Generate random points (1-10)
    points_earned = random.randint(1, 10)
    
    # Create check-in record
    checkin = CheckIn(
        user_id=current_user.id,
        check_in_date=datetime.utcnow(),
        points_earned=points_earned
    )
    db.add(checkin)
    
    # Update user points
    current_user.points += points_earned
    
    # Add points log
    points_log = PointsLog(
        user_id=current_user.id,
        points=points_earned,
        reason="Daily check-in"
    )
    db.add(points_log)
    
    db.commit()
    
    return CheckInResponse(
        success=True,
        points_earned=points_earned,
        message=f"Check-in successful! You earned {points_earned} points",
        total_points=current_user.points
    )

# 兼容前端的 API 路径
@app.post("/api/users/checkin")
async def check_in_compat(
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    from datetime import date

    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())

    # Check if already checked in today
    existing = db.query(CheckIn).filter(
        CheckIn.user_id == current_user.id,
        CheckIn.check_in_date >= today_start,
        CheckIn.check_in_date <= today_end
    ).first()

    if existing:
        return {
            "success": False,
            "points": 0,
            "message": "Already checked in today, come back tomorrow",
            "total_points": current_user.points
        }

    # Generate random points (1-10)
    points_earned = random.randint(1, 10)

    # Create check-in record
    checkin = CheckIn(
        user_id=current_user.id,
        check_in_date=datetime.utcnow(),
        points_earned=points_earned
    )
    db.add(checkin)

    # Update user points
    current_user.points += points_earned

    # Add points log
    points_log = PointsLog(
        user_id=current_user.id,
        points=points_earned,
        reason="Daily check-in"
    )
    db.add(points_log)

    db.commit()

    return {
        "success": True,
        "points": points_earned,
        "message": f"Check-in successful! You earned {points_earned} points",
        "total_points": current_user.points
    }

@app.get("/api/checkin/status", response_model=CheckInStatus)
async def get_checkin_status(
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    from datetime import date

    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())

    today_checkin = db.query(CheckIn).filter(
        CheckIn.user_id == current_user.id,
        CheckIn.check_in_date >= today_start,
        CheckIn.check_in_date <= today_end
    ).first()

    last_checkin = db.query(CheckIn).filter(
        CheckIn.user_id == current_user.id
    ).order_by(CheckIn.check_in_date.desc()).first()

    return CheckInStatus(
        has_checked_in_today=today_checkin is not None,
        last_check_in_date=last_checkin.check_in_date if last_checkin else None
    )

# Points System
@app.get("/api/points", response_model=List[PointsLogResponse])
async def get_points_log(
    current_user: User = Depends(get_current_user_user),
    db: Session = Depends(get_db)
):
    logs = db.query(PointsLog).filter(
        PointsLog.user_id == current_user.id
    ).order_by(PointsLog.created_at.desc()).all()
    return logs

@app.get("/api/points/total")
async def get_total_points(current_user: User = Depends(get_current_user_user)):
    return {"total_points": current_user.points}

# 兼容前端的 API 路径
@app.get("/api/users/points")
async def get_user_points_compat(current_user: User = Depends(get_current_user_user)):
    return {"points": current_user.points}

@app.on_event("startup")
async def startup_event():
    """应用启动时执行数据初始化"""
    from init_data import init_database
    init_database()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
