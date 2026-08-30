from fastapi import APIRouter, Depends, Query
from supabase import Client

from app.auth import CurrentUser, get_current_user
from app.database import get_supabase
from app.schemas import EvidenceCreate, EvidenceItem

router = APIRouter(tags=["evidence"])


@router.get("/evidence", response_model=list[EvidenceItem])
def list_evidence(
    source_type: str | None = Query(default=None),
    status: str | None = Query(default=None),
    supabase: Client = Depends(get_supabase),
):
    query = supabase.table("evidence_items").select("*").order("published_on", desc=True)
    if source_type:
        query = query.eq("source_type", source_type)
    if status:
        query = query.eq("verification_status", status)
    result = query.execute()
    return result.data


@router.get("/situations/{situation_id}/evidence", response_model=list[EvidenceItem])
def list_evidence_for_situation(situation_id: str, supabase: Client = Depends(get_supabase)):
    result = (
        supabase.table("evidence_items")
        .select("*")
        .eq("situation_id", situation_id)
        .order("published_on", desc=True)
        .execute()
    )
    return result.data


@router.post("/evidence", response_model=EvidenceItem, status_code=201)
def create_evidence(
    payload: EvidenceCreate,
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    """Adds a new evidence item. Requires a signed-in researcher."""
    row = payload.model_dump(mode="json")
    result = supabase.table("evidence_items").insert(row).execute()

    # Keep the situation's cached evidence_count in sync.
    count_result = (
        supabase.table("evidence_items")
        .select("id", count="exact")
        .eq("situation_id", payload.situation_id)
        .execute()
    )
    supabase.table("situations").update({"evidence_count": count_result.count}).eq(
        "id", payload.situation_id
    ).execute()

    return result.data[0]
