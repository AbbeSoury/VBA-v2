from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LessonBase(BaseModel):
    title: str
    content: Optional[str] = None
    course_id: str
    order_index: Optional[int] = None
    is_hidden: Optional[bool] = False

class LessonCreate(LessonBase):
    pass

class LessonUpdate(LessonBase):
    pass

class LessonRead(LessonBase):
    id: str
    created_at: Optional[datetime] = None