from fastapi import APIRouter, HTTPException, Header, status, Depends, Request, Query
from app.services.supabase_client import get_supabase
from app.schemas.exercise import ExerciseCreate
from typing import Optional

router = APIRouter()

TEACHER_TOKEN = "secret-teacher-token"
def get_current_teacher(request: Request):
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
    token = auth.split(" ", 1)[1]
    if token != TEACHER_TOKEN:
        raise HTTPException(status_code=403, detail="Not authorized as teacher")
    return {"role": "teacher"}

@router.post("/exercises", status_code=status.HTTP_201_CREATED, tags=["Exercises"])
def create_exercise(
    exercise: ExerciseCreate,
    teacher=Depends(get_current_teacher)
):
    supabase = get_supabase()
    data = exercise.dict()
    response = supabase.table("exercises").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'exercice")
    return response.data[0]

@router.get("/exercises", tags=["Exercises"])
def list_exercises(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    course_id: Optional[str] = None,
    type: Optional[str] = None
):
    """
    Récupère la liste des exercices (non masqués).
    - **limit**: nombre maximum d'exercices à retourner (défaut: 20)
    - **offset**: décalage pour la pagination (défaut: 0)
    - **course_id**: (optionnel) filtre pour retourner uniquement les exercices d'un cours donné (recommandé pour obtenir tous les exercices d'un cours)
    - **type**: (optionnel) filtre par type d'exercice
    
    Exemple d'usage RESTful recommandé pour obtenir tous les exercices d'un cours :
    GET /exercises?course_id=ID_DU_COURS
    """
    supabase = get_supabase()
    query = supabase.table("exercises").select("*").eq("is_hidden", False)
    if course_id:
        query = query.eq("course_id", course_id)
    if type:
        query = query.eq("type", type)
    response = query.range(offset, offset + limit - 1).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.get("/exercises/{exercise_id}", tags=["Exercises"])
def get_exercise(exercise_id: str):
    supabase = get_supabase()
    response = supabase.table("exercises").select("*").eq("id", exercise_id).single().execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return response.data

@router.patch("/exercises/{exercise_id}", tags=["Exercises"])
def update_exercise(
    exercise_id: str,
    exercise: ExerciseCreate,
    teacher=Depends(get_current_teacher)
):
    supabase = get_supabase()
    data = exercise.dict(exclude_unset=True)
    response = supabase.table("exercises").update(data).eq("id", exercise_id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Exercise not found or not updated")
    return response.data[0]

@router.delete("/exercises/{exercise_id}", tags=["Exercises"])
def delete_exercise(exercise_id: str, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    response = supabase.table("exercises").update({"is_hidden": True}).eq("id", exercise_id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Exercise not found or not deleted")
    return {"success": True, "exercise": response.data[0]}

@router.patch("/exercises/{exercise_id}/restore", tags=["Exercises"])
def restore_exercise(exercise_id: str, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    response = supabase.table("exercises").update({"is_hidden": False}).eq("id", exercise_id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Exercise not found or not restored")
    return {"success": True, "exercise": response.data[0]}

@router.get("/exercises/{course_id}", tags=["Exercises"])
def get_exercises_by_course(course_id: str):
    """
    Récupère tous les exercices d'un cours donné (non masqués).
    - **course_id**: identifiant du cours
    - **Retour**: liste des exercices (array d'objets)
    """
    supabase = get_supabase()
    response = supabase.table("exercises").select("*").eq("course_id", course_id).eq("is_hidden", False).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data 