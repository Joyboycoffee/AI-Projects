from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any

from app.models import User
from app.utils.security import get_current_active_user
from app.services.ai_service import ai_service

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/optimize")
async def optimize_resume_section(
    section: str,
    content: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Optimize a resume section using Claude AI.
    Requires Pro subscription.
    """

    # Check if user has AI access (Pro plan)
    if current_user.plan != "pro":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="AI optimization is available for Pro users only. Upgrade to access this feature."
        )

    # Validate section
    valid_sections = ["summary", "experience", "skills", "education", "projects"]
    if section not in valid_sections:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid section. Must be one of: {', '.join(valid_sections)}"
        )

    # Optimize content
    result = await ai_service.optimize_resume_section(section, content)

    return result


@router.post("/suggest-keywords")
async def suggest_keywords(
    job_title: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Suggest ATS keywords based on job title.
    Available to all users.
    """

    result = await ai_service.suggest_ats_keywords(job_title)

    return result


@router.get("/status")
async def get_ai_status():
    """Check if AI service is configured."""

    from app.config import get_settings
    settings = get_settings()

    return {
        "configured": bool(settings.ANTHROPIC_API_KEY),
        "message": "AI service is ready" if settings.ANTHROPIC_API_KEY else "AI service not configured. Add ANTHROPIC_API_KEY to .env file."
    }
