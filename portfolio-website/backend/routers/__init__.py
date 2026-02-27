from fastapi import APIRouter

from .admin import router as admin_router
from .images import router as images_router
from .card_styles import router as card_styles_router
from .project_categories import router as project_categories_router
from .projects import router as projects_router
from .experiences import router as experiences_router
from .skills import router as skills_router
from .social_links import router as social_links_router

api_router = APIRouter()

api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
api_router.include_router(images_router, prefix="/images", tags=["images"])
api_router.include_router(card_styles_router, prefix="/card-styles", tags=["card-styles"])
api_router.include_router(project_categories_router, prefix="/project-categories", tags=["project-categories"])
api_router.include_router(projects_router, prefix="/projects", tags=["projects"])
api_router.include_router(experiences_router, prefix="/experiences", tags=["experiences"])
api_router.include_router(skills_router, prefix="/skills", tags=["skills"])
api_router.include_router(social_links_router, prefix="/social-links", tags=["social-links"])
