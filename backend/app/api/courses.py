from fastapi import APIRouter, HTTPException, Body, Header, status, Depends, Request
from app.services.supabase_client import get_supabase
from app.schemas.course import CourseCreate
from typing import Optional

router = APIRouter()

# Dépendance d'authentification simulée
TEACHER_TOKEN = "secret-teacher-token"
def get_current_teacher(request: Request):
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
    token = auth.split(" ", 1)[1]
    if token != TEACHER_TOKEN:
        raise HTTPException(status_code=403, detail="Not authorized as teacher")
    return {"role": "teacher"}

@router.get("/courses", tags=["Courses"])
def list_courses(limit: int = 20, offset: int = 0):
    supabase = get_supabase()
    # On filtre pour ne pas retourner les cours masqués et on trie par order_index
    response = (
        supabase
        .table("courses")
        .select("*")
        .eq("is_hidden", False)
        .order("order_index", desc=False)
        .range(offset, offset + limit - 1)
        .execute()
    )
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.get("/courses/{course_id}", tags=["Courses"])
def get_course(course_id: str):
    supabase = get_supabase()
    response = supabase.table("courses").select("*").eq("id", course_id).single().execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Course not found")
    return response.data

@router.post("/courses", status_code=status.HTTP_201_CREATED, tags=["Courses"])
def create_course(
    course: CourseCreate,
    teacher_id: Optional[str] = Header(None)
):
    supabase = get_supabase()
    tid = teacher_id or course.teacher_id
    if not tid:
        raise HTTPException(status_code=400, detail="teacher_id requis (header ou body)")
    data = course.dict()
    data["teacher_id"] = tid
    response = supabase.table("courses").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création du cours")
    return response.data[0]

@router.delete("/courses/{course_id}", tags=["Courses"])
def delete_course(course_id: str, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    # On met à jour le champ is_hidden à True
    response = supabase.table("courses").update({"is_hidden": True}).eq("id", course_id).execute()
    # Gestion d'erreur basique
    error = getattr(response, "error", None)
    if error:
        raise HTTPException(status_code=500, detail=str(error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Erreur lors de la suppression (hide) du cours")
    return {"success": True, "course": response.data[0]}

@router.patch("/courses/{course_id}/restore", tags=["Courses"])
def restore_course(course_id: str, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    # On remet le champ is_hidden à False
    response = supabase.table("courses").update({"is_hidden": False}).eq("id", course_id).execute()
    error = getattr(response, "error", None)
    if error:
        raise HTTPException(status_code=500, detail=str(error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Erreur lors de la restauration du cours")
    return {"success": True, "course": response.data[0]}

@router.patch("/courses/{course_id}", tags=["Courses"])
def update_course(
    course_id: str,
    course: CourseCreate,
    teacher=Depends(get_current_teacher)
):
    supabase = get_supabase()
    data = course.dict(exclude_unset=True)
    response = supabase.table("courses").update(data).eq("id", course_id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Course not found or not updated")
    return response.data[0]