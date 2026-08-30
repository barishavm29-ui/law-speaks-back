# PROJECT SUMMARY — The Law Speaks Back
*(Paste this whole file into a new chat / different AI to resume work with full context.)*

## What this is
A website called **"The Law Speaks Back"** — a global research and
civic-learning platform for International Humanitarian Law (IHL) and
International Human Rights Law (IHRL). It combines legal sources, live
public data, journalism, open-source evidence, academic research and public
discussion in one platform, while keeping verified evidence, allegation,
opinion, legal interpretation and policy proposals clearly distinguished.

Tagline: *"The law isn't finished until you speak."*

## Tech stack (decided, do not change without reason)
- **Frontend:** Next.js 14, App Router, TypeScript, Tailwind CSS, shadcn/ui, lucide-react
- **Backend:** FastAPI (Python)
- **Database & Auth:** Supabase (Postgres + Auth), accessed by the backend via the `supabase-py` client using the service_role key
- Frontend talks to Supabase directly only for auth (`lib/supabase/client.ts` + `server.ts`); all app data reads/writes go through the FastAPI backend at `NEXT_PUBLIC_API_BASE_URL`
- Authenticated write requests attach the Supabase access token as a Bearer header; the backend verifies it with the Supabase JWT secret (`app/auth.py`)

## Design system (implemented — keep consistent)
"Case-file / dossier" visual identity:
- **Colors:** paper background, deep navy primary, amber/wax-seal accent (`hsl(36 56% 45%)`), verified=green, disputed=rust, pending=amber — CSS vars in `app/globals.css`
- **Type:** Source Serif 4 (display/headings), Inter (body), IBM Plex Mono (metadata: dates, publishers, source types)
- **Signature element:** `components/verification-stamp.tsx` — a rotated "stamp" badge (Verified / Reported / Disputed / Unconfirmed) used everywhere a claim or source needs a status. Never implies legal proof.

## Project structure
```
law-speaks-back/
├─ README.md
├─ PROJECT_SUMMARY.md       ← this file
├─ frontend/
│  ├─ app/
│  │  ├─ page.tsx                        Home
│  │  ├─ situations/page.tsx             Situation Observatory (list)
│  │  ├─ situations/[id]/page.tsx        Situation Observatory (detail)
│  │  ├─ evidence/page.tsx               Evidence Room
│  │  ├─ legal-hub/page.tsx              Legal Research Hub
│  │  ├─ forum/page.tsx                  Open Voice (public forum, posting works)
│  │  ├─ policy-lab/page.tsx             Policy Lab
│  │  ├─ learn/page.tsx                  Learn (courses)
│  │  ├─ workspace/page.tsx              Research Workspace (project list)
│  │  ├─ workspace/new/page.tsx          Research Workspace (create project)
│  │  ├─ workspace/[id]/page.tsx         Research Workspace (project detail + sources)
│  │  ├─ research/page.tsx               "Research question of the day" detail
│  │  ├─ methodology/page.tsx            Verification methodology explainer
│  │  ├─ berkeley-protocol/page.tsx      Open-source investigation standards
│  │  ├─ safety/page.tsx                 Source safety explainer
│  │  ├─ login/page.tsx, signup/page.tsx Supabase auth
│  │  └─ globals.css                     design tokens
│  ├─ components/           nav-bar, site-footer, situation-card, source-matrix,
│  │                        verification-stamp, ui/ (shadcn primitives)
│  ├─ lib/                  api.ts (backend client, all endpoints), types.ts,
│  │                        mock-data.ts (fallback only), supabase/client.ts + server.ts, utils.ts
│  └─ middleware.ts          Supabase session refresh
├─ backend/
│  ├─ main.py                FastAPI entrypoint, CORS, all routers included
│  ├─ app/
│  │  ├─ config.py           env settings
│  │  ├─ database.py         Supabase client (service_role)
│  │  ├─ auth.py             JWT verification dependency (get_current_user)
│  │  ├─ schemas.py          all Pydantic models
│  │  └─ routers/
│  │     ├─ situations.py    GET/POST /situations
│  │     ├─ evidence.py      GET/POST /evidence
│  │     ├─ forum.py         GET/POST /forum-posts
│  │     ├─ policy.py        GET/POST /policy-proposals
│  │     ├─ legal.py         GET /legal-documents
│  │     ├─ courses.py       GET /courses
│  │     └─ workspace.py     GET/POST /workspace/projects, /workspace/projects/{id}/sources (owner-scoped)
│  └─ schema.sql             ALL Supabase tables + RLS + seed data (run this once, in full)
```

## Build status by blueprint section — everything is now wired

| # | Section | Status |
|---|---|---|
| 3 | Home page | ✅ Full — hero, live situations, research question (links to real `/research` page), latest evidence, policy/learn teasers |
| 4 | Situation Observatory | ✅ Full — list + detail (evidence tab, source matrix tab, open questions tab), real Supabase data |
| 5 | Evidence Room | ✅ Full — real Supabase data |
| 6 | Source Matrix | ⚠️ Component built and used, but still fed **demo rows derived from open_questions** — no dedicated `source_matrix` DB table yet. Lowest-priority remaining gap. |
| 7 | Legal Research Hub | ✅ Full — real Supabase table (`legal_documents`), GET-only (seeded content, no submission form) |
| 8 | Live data layer (OHCHR API) | ❌ Not started. Needs a backend route calling the OHCHR Universal Human Rights Index public API + caching. |
| 9 | Journalism as research input | ✅ Covered conceptually via `source_type` in Evidence Room |
| 10 | Open-source investigation (Berkeley Protocol) | ✅ `/berkeley-protocol` page built (static explainer, no DB) |
| 11 | Public Forum — Open Voice | ✅ Full — real Supabase table, **signed-in users can actually post** (form on the page), list is live |
| 12 | Research Workspace | ✅ Full — project list, create project, project detail with source collection, all owner-scoped via RLS + backend auth. Literature review / annotation / peer-review sub-features NOT built (see below). |
| 13 | Policy Lab | ✅ Full — real Supabase table (`policy_proposals`), GET-only in the UI (backend POST endpoint exists but no submission form yet) |
| — | Auth (login/signup) | ✅ Full — Supabase Auth email/password |
| — | Footer/static pages: methodology, berkeley-protocol, safety, research | ✅ All 4 built as static content pages |

**Everything now has either a real backend endpoint + Supabase table, or (for the 2 remaining gaps) a clearly-flagged demo.**

## What's still genuinely incomplete
1. **Source Matrix** — UI works but data is synthetic per-situation, not a real per-claim table
2. **OHCHR live data layer** (blueprint section 8) — no integration at all yet
3. **Policy Lab submission form** — backend `POST /policy-proposals` exists, frontend has no create form yet (Forum and Workspace both have working create forms as the reference pattern)
4. **Research Workspace** — only "create project + collect sources" exists. Missing from the original spec: annotate documents, build a literature review, map legal authorities, identify contradictions, publish a working paper, peer review
5. Forum posts aren't yet linkable to a specific situation from the situation detail page itself (the DB column `situation_id` supports it, UI doesn't expose it yet)

## Setup status (as of last message)
User was mid-way through Supabase setup (given an 8-step walkthrough: create project → run `schema.sql` in full, including the Phase 2 tables appended later → copy URL/anon key/service_role key/JWT secret → fill both `.env` files → run both servers). **Confirm this is working before building anything else** — if `schema.sql` was run before the Phase 2 tables (forum_posts, policy_proposals, legal_documents, courses, workspace_projects, workspace_sources) were appended, it needs to be re-run (safe — uses `if not exists` / `on conflict do nothing`).

## Suggested next steps, in order
1. Confirm Supabase + both servers actually run end-to-end (situations/evidence should show real seeded data, not mock)
2. Add a Policy Lab submission form (copy the Forum posting pattern)
3. Add situation-linking to forum posts (dropdown on the post form)
4. Decide if Research Workspace needs the literature-review/annotation/peer-review features, or if the current scope is enough for now
5. OHCHR live data layer, if wanted — lowest priority, most external-API-dependent

## User's working style / preferences (context for tone)
- Communicates in Tanglish (Tamil-English mix), casual tone, wants step-by-step guidance
- Prefers concrete deliverables (zip files) over just code snippets, so they can open directly in VS Code
- Is a developer but has more frontend (React/Next.js) experience than backend/database experience — needs backend/Supabase steps spelled out plainly
- Separately owns a Leave Module (unrelated project — HRM system for Singapore) — not related to this project, don't mix them up
