export type VerificationStatus = "verified" | "reported" | "disputed" | "unconfirmed";

export type LegalFramework = "IHL" | "IHRL" | "ICL" | "Domestic";

export interface Situation {
  id: string;
  slug: string;
  title: string;
  region: string;
  country: string;
  summary: string;
  status: VerificationStatus;
  legal_frameworks: LegalFramework[];
  actors: string[];
  started_on: string;
  updated_at: string;
  evidence_count: number;
  open_questions: string[];
}

export type SourceType =
  | "official_statement"
  | "local_journalism"
  | "international_journalism"
  | "ngo_documentation"
  | "eyewitness"
  | "open_source"
  | "legal_finding"
  | "academic";

export interface EvidenceItem {
  id: string;
  situation_id: string;
  title: string;
  source_type: SourceType;
  publisher: string;
  author?: string | null;
  published_on: string;
  collected_on?: string | null;
  url?: string | null;
  media_type: "document" | "image" | "video" | "dataset" | "article" | "testimony";
  language: string;
  verification_status: VerificationStatus;
  context: string;
  limitations?: string | null;
  access_restricted: boolean;
}

export interface SourceMatrixRow {
  claim: string;
  positions: Partial<Record<SourceType, "supports" | "contradicts" | "unclear" | "silent">>;
}

export type PostLabel =
  | "Opinion"
  | "Factual Claim"
  | "Legal Analysis"
  | "Question"
  | "Research Finding"
  | "Policy Proposal";

export interface ForumPost {
  id: string;
  situation_slug?: string | null;
  author_name: string;
  label: PostLabel;
  title: string;
  body: string;
  sources_attached: number;
  challenges: number;
  created_at: string;
}

export type PolicyProposalStage =
  | "problem"
  | "evidence"
  | "legal_basis"
  | "community_review"
  | "institutional_review";

export interface PolicyProposal {
  id: string;
  title: string;
  problem: string;
  evidence_summary: string;
  legal_basis: string;
  affected_stakeholders: string[];
  proposed_intervention: string;
  implementation_pathway: string;
  risks: string;
  resource_implications: string;
  measurable_indicators: string[];
  stage: PolicyProposalStage;
  updated_at: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  category: "Treaty" | "Customary IHL" | "Jurisprudence" | "UN Material" | "Commentary";
  jurisdiction: string;
  year: number;
  summary: string;
  external_url?: string | null;
}

export interface Course {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration_minutes: number;
  description: string;
  modules: string[];
}

export interface WorkspaceProject {
  id: string;
  title: string;
  research_question: string;
  methodology?: string | null;
  status: "draft" | "active" | "published";
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceSource {
  id: string;
  project_id: string;
  title: string;
  url?: string | null;
  note?: string | null;
  added_at: string;
}
