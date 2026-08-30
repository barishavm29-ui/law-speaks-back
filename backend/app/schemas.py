from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel

VerificationStatus = Literal["verified", "reported", "disputed", "unconfirmed"]
LegalFramework = Literal["IHL", "IHRL", "ICL", "Domestic"]
SourceType = Literal[
    "official_statement",
    "local_journalism",
    "international_journalism",
    "ngo_documentation",
    "eyewitness",
    "open_source",
    "legal_finding",
    "academic",
]
MediaType = Literal["document", "image", "video", "dataset", "article", "testimony"]


class Situation(BaseModel):
    id: str
    slug: str
    title: str
    region: str
    country: str
    summary: str
    status: VerificationStatus
    legal_frameworks: list[LegalFramework]
    actors: list[str]
    started_on: date
    updated_at: datetime
    evidence_count: int
    open_questions: list[str]


class SituationCreate(BaseModel):
    slug: str
    title: str
    region: str
    country: str
    summary: str
    status: VerificationStatus = "unconfirmed"
    legal_frameworks: list[LegalFramework] = []
    actors: list[str] = []
    started_on: date
    open_questions: list[str] = []


class EvidenceItem(BaseModel):
    id: str
    situation_id: str
    title: str
    source_type: SourceType
    publisher: str
    author: Optional[str] = None
    published_on: date
    collected_on: Optional[date] = None
    url: Optional[str] = None
    media_type: MediaType
    language: str
    verification_status: VerificationStatus
    context: str
    limitations: Optional[str] = None
    access_restricted: bool = False


class EvidenceCreate(BaseModel):
    situation_id: str
    title: str
    source_type: SourceType
    publisher: str
    author: Optional[str] = None
    published_on: date
    collected_on: Optional[date] = None
    url: Optional[str] = None
    media_type: MediaType
    language: str
    verification_status: VerificationStatus = "unconfirmed"
    context: str
    limitations: Optional[str] = None
    access_restricted: bool = False


PostLabel = Literal[
    "Opinion", "Factual Claim", "Legal Analysis", "Question", "Research Finding", "Policy Proposal"
]


class ForumPost(BaseModel):
    id: str
    situation_id: Optional[str] = None
    author_id: Optional[str] = None
    author_name: str
    label: PostLabel
    title: str
    body: str
    sources_attached: int = 0
    challenges: int = 0
    created_at: datetime


class ForumPostCreate(BaseModel):
    situation_id: Optional[str] = None
    label: PostLabel
    title: str
    body: str


PolicyStage = Literal["problem", "evidence", "legal_basis", "community_review", "institutional_review"]


class PolicyProposal(BaseModel):
    id: str
    title: str
    problem: str
    evidence_summary: str
    legal_basis: str
    affected_stakeholders: list[str]
    proposed_intervention: str
    implementation_pathway: str
    risks: str
    resource_implications: str
    measurable_indicators: list[str]
    stage: PolicyStage
    updated_at: datetime


class PolicyProposalCreate(BaseModel):
    title: str
    problem: str
    evidence_summary: str
    legal_basis: str
    affected_stakeholders: list[str] = []
    proposed_intervention: str
    implementation_pathway: str
    risks: str
    resource_implications: str
    measurable_indicators: list[str] = []
    stage: PolicyStage = "problem"


LegalCategory = Literal["Treaty", "Customary IHL", "Jurisprudence", "UN Material", "Commentary"]


class LegalDocument(BaseModel):
    id: str
    title: str
    category: LegalCategory
    jurisdiction: str
    year: int
    summary: str
    external_url: Optional[str] = None


CourseLevel = Literal["Beginner", "Intermediate", "Advanced"]


class Course(BaseModel):
    id: str
    title: str
    level: CourseLevel
    duration_minutes: int
    description: str
    modules: list[str]


WorkspaceStatus = Literal["draft", "active", "published"]


class WorkspaceProject(BaseModel):
    id: str
    title: str
    research_question: str
    methodology: Optional[str] = None
    status: WorkspaceStatus
    owner_id: str
    created_at: datetime
    updated_at: datetime


class WorkspaceProjectCreate(BaseModel):
    title: str
    research_question: str
    methodology: Optional[str] = None
    status: WorkspaceStatus = "draft"


class WorkspaceSource(BaseModel):
    id: str
    project_id: str
    title: str
    url: Optional[str] = None
    note: Optional[str] = None
    added_at: datetime


class WorkspaceSourceCreate(BaseModel):
    title: str
    url: Optional[str] = None
    note: Optional[str] = None
