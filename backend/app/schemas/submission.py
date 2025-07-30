from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SubmissionBase(BaseModel):
    user_id: str
    exercise_id: str
    code: Optional[str] = None
    output: Optional[str] = None
    score: Optional[int] = None
    feedback: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionRead(SubmissionBase):
    id: str
    created_at: Optional[datetime] = None