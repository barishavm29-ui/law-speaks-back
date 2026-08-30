from fastapi import APIRouter, Depends, Query
from supabase import Client

from app.auth import CurrentUser, get_current_user
from app.database import get_supabase
from app.schemas import ForumPost, ForumPostCreate

router = APIRouter(prefix="/forum-posts", tags=["forum"])


@router.get("", response_model=list[ForumPost])
def list_posts(
    situation_id: str | None = Query(default=None),
    supabase: Client = Depends(get_supabase),
):
    query = supabase.table("forum_posts").select("*").order("created_at", desc=True)
    if situation_id:
        query = query.eq("situation_id", situation_id)
    result = query.execute()
    return result.data


@router.post("", response_model=ForumPost, status_code=201)
def create_post(
    payload: ForumPostCreate,
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    """Creates a forum post. Requires a signed-in user (auth.uid() becomes author_id)."""
    row = payload.model_dump(mode="json")
    row["author_id"] = user.id
    row["author_name"] = user.email or "Anonymous researcher"
    result = supabase.table("forum_posts").insert(row).execute()
    return result.data[0]
