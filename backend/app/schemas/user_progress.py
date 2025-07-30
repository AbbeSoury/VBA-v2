from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserProgressBase(BaseModel):
    user_id: str
    lesson_id: str
    completed_at: Optional[datetime] = None

class UserProgressCreate(UserProgressBase):
    pass

class UserProgressRead(UserProgressBase):
    id: str