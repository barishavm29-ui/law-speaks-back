from fastapi import APIRouter, Depends
from supabase import Client

from app.database import get_supabase
from app.schemas import Course

router = APIRouter(prefix="/courses", tags=["learn"])


@router.get("", response_model=list[Course])
def list_courses(supabase: Client = Depends(get_supabase)):
    result = supabase.table("courses").select("*").execute()
    return result.data
