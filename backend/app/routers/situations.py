from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from app.auth import CurrentUser, get_current_user
from app.database import get_supabase
from app.schemas import Situation, SituationCreate

router = APIRouter(prefix="/situations", tags=["situations"])


@router.get("", response_model=list[Situation])
def list_situations(
    status: str | None = Query(default=None),
    q: str | None = Query(default=None),
    supabase: Client = Depends(get_supabase),
):
    query = supabase.table("situations").select("*").order("updated_at", desc=True)
    if status:
        query = query.eq("status", status)
    if q:
        query = query.ilike("title", f"%{q}%")
    result = query.execute()
    return result.data


@router.get("/{slug}", response_model=Situation)
def get_situation(slug: str, supabase: Client = Depends(get_supabase)):
    result = supabase.table("situations").select("*").eq("slug", slug).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Situation not found")
    return result.data[0]


@router.post("", response_model=Situation, status_code=201)
def create_situation(
    payload: SituationCreate,
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    """Creates a new research situation. Requires a signed-in researcher."""
    row = payload.model_dump(mode="json")
    row["evidence_count"] = 0
    result = supabase.table("situations").insert(row).execute()
    return result.data[0]
