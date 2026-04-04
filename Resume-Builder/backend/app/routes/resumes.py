from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Resume, Download
from app.schemas import ResumeCreate, ResumeUpdate, ResumeResponse
from app.utils.security import get_current_active_user
from app.services.pdf_service import pdf_service
from app.services.ai_service import ai_service
from app.schemas.resume import AIOptimizeRequest

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])


@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    resume_data: ResumeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new resume."""

    new_resume = Resume(
        user_id=current_user.id,
        title=resume_data.title,
        content=resume_data.content.model_dump(),
        template=resume_data.template
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume


@router.get("/", response_model=List[ResumeResponse])
async def get_user_resumes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all resumes for the current user."""

    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).offset(skip).limit(limit).all()

    return resumes


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific resume by ID."""

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    return resume


@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: int,
    resume_data: ResumeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a resume."""

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    # Update fields
    if resume_data.title is not None:
        resume.title = resume_data.title
    if resume_data.content is not None:
        resume.content = resume_data.content.model_dump()
    if resume_data.template is not None:
        resume.template = resume_data.template

    db.commit()
    db.refresh(resume)

    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a resume."""

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    db.delete(resume)
    db.commit()

    return None


@router.post("/{resume_id}/download")
async def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Generate and download resume as PDF."""

    # Check download limits for free plan
    if current_user.plan == "free":
        if current_user.downloads_used >= current_user.downloads_limit:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Download limit reached. Upgrade to Pro for unlimited downloads."
            )

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    # Generate PDF
    pdf_bytes = pdf_service.generate_pdf(
        content=resume.content,
        template=resume.template
    )

    # Track download for free users
    if current_user.plan == "free":
        current_user.downloads_used += 1

    # Record download
    download = Download(
        user_id=current_user.id,
        resume_id=resume.id,
        file_format="pdf"
    )
    db.add(download)
    db.commit()

    return {
        "success": True,
        "message": "PDF generated successfully",
        "filename": f"{resume.title.replace(' ', '_')}.pdf",
        "pdf_base64": pdf_bytes.decode('latin1') if isinstance(pdf_bytes, bytes) else pdf_bytes
    }


@router.post("/{resume_id}/optimize")
async def optimize_resume(
    resume_id: int,
    optimize_data: AIOptimizeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Optimize a resume section using AI."""

    # Check if user has AI access (Pro plan)
    if current_user.plan != "pro":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="AI optimization is available for Pro users only."
        )

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    # Optimize content using AI
    result = await ai_service.optimize_resume_section(
        section=optimize_data.section,
        content=optimize_data.content
    )

    return result


@router.post("/{resume_id}/duplicate", response_model=ResumeResponse)
async def duplicate_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Duplicate a resume."""

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    # Create new resume with same content
    new_resume = Resume(
        user_id=current_user.id,
        title=f"{resume.title} (Copy)",
        content=resume.content,
        template=resume.template
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume
