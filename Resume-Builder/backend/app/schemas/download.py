from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DownloadCreate(BaseModel):
    resume_id: int
    file_format: str = "pdf"


class DownloadResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    file_format: str
    created_at: datetime

    class Config:
        from_attributes = True
