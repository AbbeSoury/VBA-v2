from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestBase(BaseModel):
    title: str
    description: Optional[str] = None
    course_id: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_published: Optional[bool] = False

class TestCreate(TestBase):
    pass

class TestRead(TestBase):
    id: str
    created_at: Optional[datetime] = None