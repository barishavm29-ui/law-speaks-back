import type {
  Course,
  EvidenceItem,
  ForumPost,
  LegalDocument,
  PolicyProposal,
  Situation,
  WorkspaceProject,
  WorkspaceSource,
} from "@/lib/types";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { accessToken?: string }
): Promise<T> {
  const { accessToken, ...rest } = init ?? {};

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(rest.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${body}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  situations: {
    list: (params?: { status?: string; q?: string }) => {
      const search = new URLSearchParams(params as Record<string, string>).toString();
      return apiFetch<Situation[]>(`/situations${search ? `?${search}` : ""}`);
    },
    get: (slug: string) => apiFetch<Situation>(`/situations/${slug}`),
  },
  evidence: {
    listBySituation: (situationId: string) =>
      apiFetch<EvidenceItem[]>(`/situations/${situationId}/evidence`),
    list: (params?: { source_type?: string; status?: string }) => {
      const search = new URLSearchParams(params as Record<string, string>).toString();
      return apiFetch<EvidenceItem[]>(`/evidence${search ? `?${search}` : ""}`);
    },
  },
  forum: {
    list: (situationId?: string) =>
      apiFetch<ForumPost[]>(`/forum-posts${situationId ? `?situation_id=${situationId}` : ""}`),
    create: (
      payload: { situation_id?: string | null; label: string; title: string; body: string },
      accessToken: string
    ) =>
      apiFetch<ForumPost>("/forum-posts", {
        method: "POST",
        body: JSON.stringify(payload),
        accessToken,
      }),
  },
  policy: {
    list: () => apiFetch<PolicyProposal[]>("/policy-proposals"),
    create: (payload: Omit<PolicyProposal, "id" | "updated_at">, accessToken: string) =>
      apiFetch<PolicyProposal>("/policy-proposals", {
        method: "POST",
        body: JSON.stringify(payload),
        accessToken,
      }),
  },
  legal: {
    list: (category?: string) =>
      apiFetch<LegalDocument[]>(`/legal-documents${category ? `?category=${category}` : ""}`),
  },
  courses: {
    list: () => apiFetch<Course[]>("/courses"),
  },
  workspace: {
    listProjects: (accessToken: string) =>
      apiFetch<WorkspaceProject[]>("/workspace/projects", { accessToken }),
    getProject: (id: string, accessToken: string) =>
      apiFetch<WorkspaceProject>(`/workspace/projects/${id}`, { accessToken }),
    createProject: (
      payload: { title: string; research_question: string; methodology?: string },
      accessToken: string
    ) =>
      apiFetch<WorkspaceProject>("/workspace/projects", {
        method: "POST",
        body: JSON.stringify(payload),
        accessToken,
      }),
    listSources: (projectId: string, accessToken: string) =>
      apiFetch<WorkspaceSource[]>(`/workspace/projects/${projectId}/sources`, { accessToken }),
    addSource: (
      projectId: string,
      payload: { title: string; url?: string; note?: string },
      accessToken: string
    ) =>
      apiFetch<WorkspaceSource>(`/workspace/projects/${projectId}/sources`, {
        method: "POST",
        body: JSON.stringify(payload),
        accessToken,
      }),
  },
};
