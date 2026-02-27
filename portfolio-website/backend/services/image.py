import os
import uuid
from pathlib import Path
from typing import Optional
from PIL import Image as PILImage
from sqlalchemy.orm import Session
from models import Image

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

THUMBNAIL_SIZE = (200, 200)

class ImageService:
    @staticmethod
    def save_image(db: Session, file_content: bytes, original_filename: str, mime_type: str) -> Image:
        # Generate unique filename
        ext = Path(original_filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save original file
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Get image dimensions
        width, height = None, None
        try:
            with PILImage.open(file_path) as img:
                width, height = img.size
        except Exception:
            pass
        
        # Create thumbnail
        thumbnail_filename = f"thumb_{unique_filename}"
        thumbnail_path = UPLOAD_DIR / thumbnail_filename
        try:
            with PILImage.open(file_path) as img:
                img.thumbnail(THUMBNAIL_SIZE)
                img.save(thumbnail_path)
        except Exception:
            thumbnail_filename = None
        
        # Create database record
        db_image = Image(
            filename=unique_filename,
            original_filename=original_filename,
            url=f"/uploads/{unique_filename}",
            thumbnail_url=f"/uploads/{thumbnail_filename}" if thumbnail_filename else None,
            mime_type=mime_type,
            size=len(file_content),
            width=width,
            height=height
        )
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
        return db_image

    @staticmethod
    def delete_image(db: Session, image_id: int) -> bool:
        image = db.query(Image).filter(Image.id == image_id).first()
        if not image:
            return False
        
        # Delete files
        try:
            file_path = UPLOAD_DIR / image.filename
            if file_path.exists():
                file_path.unlink()
            
            if image.thumbnail_url:
                thumb_path = UPLOAD_DIR / Path(image.thumbnail_url).name
                if thumb_path.exists():
                    thumb_path.unlink()
        except Exception:
            pass
        
        # Delete database record
        db.delete(image)
        db.commit()
        return True

    @staticmethod
    def get_image(db: Session, image_id: int) -> Optional[Image]:
        return db.query(Image).filter(Image.id == image_id).first()

    @staticmethod
    def get_images(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Image).order_by(Image.created_at.desc()).offset(skip).limit(limit).all()
