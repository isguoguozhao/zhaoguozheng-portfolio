from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional

from models import get_db, AdminUser
from schemas import Token, AdminLogin, AdminUserResponse
from services import AuthService

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> AdminUser:
    token_data = AuthService.decode_token(token)
    if token_data is None or token_data.username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(AdminUser).filter(AdminUser.username == token_data.username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_active_user(
    current_user: AdminUser = Depends(get_current_user)
) -> AdminUser:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    AuthService.update_last_login(db, user)
    access_token = AuthService.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    # JWT tokens are stateless, client should discard the token
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=AdminUserResponse)
async def read_users_me(
    current_user: AdminUser = Depends(get_current_active_user)
):
    return current_user

@router.post("/create-default-admin")
async def create_default_admin(db: Session = Depends(get_db)):
    """Create a default admin user if none exists"""
    existing_user = db.query(AdminUser).filter(AdminUser.username == "admin").first()
    if existing_user:
        return {"message": "Admin user already exists"}
    
    hashed_password = AuthService.get_password_hash("admin123")
    admin_user = AdminUser(
        username="admin",
        email="admin@example.com",
        hashed_password=hashed_password,
        is_active=True,
        is_superuser=True
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    return {"message": "Default admin user created", "username": "admin", "password": "admin123"}
