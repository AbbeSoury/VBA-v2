from fastapi import APIRouter, HTTPException, status, Depends, Path
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase
from app.schemas.lesson import LessonCreate, LessonUpdate
from typing import List

router = APIRouter()

TEACHER_TOKEN = "secret-teacher-token"
security = HTTPBearer()

def get_current_teacher(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != TEACHER_TOKEN:
        raise HTTPException(status_code=403, detail="Not authorized as teacher")
    return {"role": "teacher"}

@router.get("/courses/{course_id}/lessons", response_model=List[dict], tags=["Lessons"])
def list_lessons(course_id: str):
    supabase = get_supabase()
    response = supabase.table("lessons").select("*").eq("course_id", course_id).eq("is_hidden", False).order("order_index").execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.get("/lessons/{id}", tags=["Lessons"])
def get_lesson(id: str):
    supabase = get_supabase()
    response = supabase.table("lessons").select("*").eq("id", id).single().execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return response.data

@router.post("/lessons", status_code=status.HTTP_201_CREATED, tags=["Lessons"])
def create_lesson(lesson: LessonCreate, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    data = lesson.dict()
    response = supabase.table("lessons").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de la leçon")
    return response.data[0]

@router.put("/lessons/{id}", tags=["Lessons"])
def update_lesson(id: str, lesson: LessonUpdate, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    data = lesson.dict(exclude_unset=True)
    response = supabase.table("lessons").update(data).eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Lesson not found or not updated")
    return response.data[0]

@router.delete("/lessons/{id}", tags=["Lessons"])
def delete_lesson(id: str, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    response = supabase.table("lessons").update({"is_hidden": True}).eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Lesson not found or not deleted")
    return {"success": True, "lesson": response.data[0]}