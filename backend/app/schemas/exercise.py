from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ExerciseBase(BaseModel):
    title: str
    description: str
    vba_template: Optional[str] = ""
    expected_output: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    hints: Optional[List[str]] = Field(default_factory=list)
    difficulty: Optional[str] = "beginner"
    max_score: Optional[int] = 100
    time_limit: Optional[int] = None
    course_id: str
    lesson_id: Optional[str] = None
    type: str  # "code", "qcm", "text"

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseRead(ExerciseBase):
    id: str
    created_at: Optional[datetime] = None 