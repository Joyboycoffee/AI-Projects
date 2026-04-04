from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# Personal Info schema
class PersonalInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    address: str = ""
    linkedin: str = ""
    website: str = ""
    summary: str = ""


# Education schema
class Education(BaseModel):
    school: str = ""
    degree: str = ""
    field: str = ""
    start_date: str = ""
    end_date: str = ""
    description: str = ""


# Experience schema
class Experience(BaseModel):
    company: str = ""
    position: str = ""
    start_date: str = ""
    end_date: str = ""
    description: str = ""
    achievements: List[str] = []


# Skill schema
class Skill(BaseModel):
    name: str = ""
    level: str = "Beginner"  # Beginner, Intermediate, Advanced, Expert


# Project schema
class Project(BaseModel):
    name: str = ""
    description: str = ""
    link: str = ""
    technologies: List[str] = []


# Resume content schema
class ResumeContent(BaseModel):
    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    education: List[Education] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    skills: List[Skill] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Dict[str, Any]] = Field(default_factory=list)
    languages: List[Dict[str, Any]] = Field(default_factory=list)


# Resume create schema
class ResumeCreate(BaseModel):
    title: str = "My Resume"
    content: ResumeContent = Field(default_factory=ResumeContent)
    template: str = "modern"


# Resume update schema
class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[ResumeContent] = None
    template: Optional[str] = None


# Resume response schema
class ResumeResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: Dict[str, Any]
    template: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# AI optimization request
class AIOptimizeRequest(BaseModel):
    section: str  # "summary", "experience", "skills", etc.
    content: str
