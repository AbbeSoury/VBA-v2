from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class QuestionBankBase(BaseModel):
    question: str
    type: str
    choices: Optional[List[str]] = None
    answer: Optional[str] = None
    created_by: Optional[str] = None

class QuestionBankCreate(QuestionBankBase):
    pass

class QuestionBankRead(QuestionBankBase):
    id: str
    created_at: Optional[datetime] = None