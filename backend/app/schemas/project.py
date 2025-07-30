from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    course_id: str
    is_published: Optional[bool] = False

class ProjectCreate(ProjectBase):
    pass

class ProjectRead(ProjectBase):
    id: str
    created_at: Optional[datetime] = None