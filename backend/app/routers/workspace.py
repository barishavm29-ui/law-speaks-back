from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.auth import CurrentUser, get_current_user
from app.database import get_supabase
from app.schemas import (
    WorkspaceProject,
    WorkspaceProjectCreate,
    WorkspaceSource,
    WorkspaceSourceCreate,
)

router = APIRouter(prefix="/workspace", tags=["research-workspace"])


@router.get("/projects", response_model=list[WorkspaceProject])
def list_my_projects(
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    """Lists the signed-in researcher's own projects (owner-scoped)."""
    result = (
        supabase.table("workspace_projects")
        .select("*")
        .eq("owner_id", user.id)
        .order("updated_at", desc=True)
        .execute()
    )
    return result.data


@router.post("/projects", response_model=WorkspaceProject, status_code=201)
def create_project(
    payload: WorkspaceProjectCreate,
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    row = payload.model_dump(mode="json")
    row["owner_id"] = user.id
    result = supabase.table("workspace_projects").insert(row).execute()
    return result.data[0]


def _assert_owns_project(supabase: Client, project_id: str, user: CurrentUser):
    result = (
        supabase.table("workspace_projects")
        .select("id, owner_id")
        .eq("id", project_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    if result.data[0]["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Not your project")


@router.get("/projects/{project_id}", response_model=WorkspaceProject)
def get_project(
    project_id: str,
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    _assert_owns_project(supabase, project_id, user)
    result = supabase.table("workspace_projects").select("*").eq("id", project_id).execute()
    return result.data[0]


@router.get("/projects/{project_id}/sources", response_model=list[WorkspaceSource])
def list_sources(
    project_id: str,
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    _assert_owns_project(supabase, project_id, user)
    result = (
        supabase.table("workspace_sources")
        .select("*")
        .eq("project_id", project_id)
        .order("added_at", desc=True)
        .execute()
    )
    return result.data


@router.post("/projects/{project_id}/sources", response_model=WorkspaceSource, status_code=201)
def add_source(
    project_id: str,
    payload: WorkspaceSourceCreate,
    supabase: Client = Depends(get_supabase),
    user: CurrentUser = Depends(get_current_user),
):
    _assert_owns_project(supabase, project_id, user)
    row = payload.model_dump(mode="json")
    row["project_id"] = project_id
    result = supabase.table("workspace_sources").insert(row).execute()
    return result.data[0]
