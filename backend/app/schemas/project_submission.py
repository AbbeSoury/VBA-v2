from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectSubmissionBase(BaseModel):
    user_id: str
    project_id: str
    content: Optional[str] = None
    score: Optional[int] = None
    feedback: Optional[str] = None

class ProjectSubmissionCreate(ProjectSubmissionBase):
    pass

class ProjectSubmissionRead(ProjectSubmissionBase):
    id: str
    created_at: Optional[datetime] = None