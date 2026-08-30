from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import courses, evidence, forum, legal, policy, situations, workspace

settings = get_settings()

app = FastAPI(
    title="The Law Speaks Back — API",
    description="Backend for the IHL/IHRL research and civic-learning platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(situations.router)
app.include_router(evidence.router)
app.include_router(forum.router)
app.include_router(policy.router)
app.include_router(legal.router)
app.include_router(courses.router)
app.include_router(workspace.router)


@app.get("/health", tags=["meta"])
def health_check():
    return {"status": "ok"}
