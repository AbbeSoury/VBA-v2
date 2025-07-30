from fastapi import APIRouter
from app.services.supabase_client import get_supabase

router = APIRouter()

@router.get("/test-supabase")
def test_supabase():
    supabase = get_supabase()
    # On récupère les 5 premiers cours pour le test
    response = supabase.table("courses").select("*").limit(5).execute()
    return response.data