from pydantic import BaseModel, Field
from typing import Optional, Any

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[Any] = Field(default_factory=dict)
    thumbnail_url: Optional[str] = None
    order_index: Optional[int] = 0
    is_published: Optional[bool] = False
    difficulty: Optional[str] = "beginner"
    estimated_hours: Optional[int] = 1
    teacher_id: Optional[str] = None 