from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Download
from app.schemas import DownloadResponse
from app.utils.security import get_current_active_user

router = APIRouter(prefix="/api/downloads", tags=["Downloads"])


@router.get("/", response_model=List[DownloadResponse])
async def get_user_downloads(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get download history for current user."""

    downloads = db.query(Download).filter(
        Download.user_id == current_user.id
    ).order_by(Download.created_at.desc()).offset(skip).limit(limit).all()

    return downloads


@router.get("/stats")
async def get_download_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get download statistics for current user."""

    total_downloads = db.query(Download).filter(
        Download.user_id == current_user.id
    ).count()

    return {
        "total_downloads": total_downloads,
        "downloads_used": current_user.downloads_used,
        "downloads_limit": current_user.downloads_limit,
        "remaining_downloads": max(0, current_user.downloads_limit - current_user.downloads_used),
        "plan": current_user.plan
    }
