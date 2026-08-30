from fastapi import APIRouter, Depends
from supabase import Client

from app.auth import CurrentUser, get_current_user
from app.database import get_supabase
from app.schemas import PolicyProposal, PolicyProposalCreate

router = APIRouter(prefix="/policy-proposals", tags=["policy-lab"])


@router.get("", response_model=list[PolicyProposal])
def list_proposals(supabase: Client = Depends(get_supabase)):
    result = supabase.table("policy_proposals").select("*").order("updated_at", desc=True).execute()
    return result.data


@router.post("", response_model=PolicyProposal, status_code=201)
def create_proposal(
    payload: PolicyProposalCreate,
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    """Submits a new policy proposal. Requires a signed-in researcher."""
    row = payload.model_dump(mode="json")
    row["created_by"] = user.id
    result = supabase.table("policy_proposals").insert(row).execute()
    return result.data[0]
