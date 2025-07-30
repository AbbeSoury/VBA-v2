from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class TestSubmissionBase(BaseModel):
    user_id: str
    test_id: str
    answers: Optional[Dict[str, Any]] = None
    score: Optional[int] = None

class TestSubmissionCreate(TestSubmissionBase):
    pass

class TestSubmissionRead(TestSubmissionBase):
    id: str
    created_at: Optional[datetime] = None