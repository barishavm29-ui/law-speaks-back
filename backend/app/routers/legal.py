from fastapi import APIRouter, Depends, Query
from supabase import Client

from app.database import get_supabase
from app.schemas import LegalDocument

router = APIRouter(prefix="/legal-documents", tags=["legal-hub"])


@router.get("", response_model=list[LegalDocument])
def list_documents(
    category: str | None = Query(default=None),
    supabase: Client = Depends(get_supabase),
):
    query = supabase.table("legal_documents").select("*").order("year", desc=True)
    if category:
        query = query.eq("category", category)
    result = query.execute()
    return result.data
