# The Law Speaks Back

A research and civic-learning platform for International Humanitarian Law
(IHL) and International Human Rights Law (IHRL): live situations, structured
evidence, source comparison, legal research, debate and policy.

Built and wired: Home, Situation Observatory, Evidence Room, Legal Research
Hub, Open Voice (forum — posting works for signed-in users), Policy Lab,
Learn, Research Workspace (create projects + collect sources), plus static
pages for methodology, the Berkeley Protocol, source safety, and the
research question of the day. All of these read from real Supabase tables
through the FastAPI backend (see `backend/schema.sql` for every table).
See `PROJECT_SUMMARY.md` for the full section-by-section status, the small
list of genuinely unfinished pieces (Source Matrix real data, OHCHR live
data layer, Policy Lab submission form), and suggested next steps — that
file is written so you can paste it into a fresh chat and resume with full
context if needed.

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript, Tailwind CSS, shadcn/ui, lucide-react
- **Backend:** FastAPI (Python)
- **Database & Auth:** Supabase (Postgres + Auth)

## Project layout

```
law-speaks-back/
├─ frontend/     Next.js app
└─ backend/      FastAPI app
```

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in the Supabase dashboard, paste the contents of
   `backend/schema.sql`, and run it. This creates the `situations` and
   `evidence_items` tables, indexes, RLS policies, and seeds three example
   situations so the site has real data on first run.
3. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret — backend only)
4. Go to **Project Settings → API → JWT Settings** and copy the `JWT Secret`.

## 2. Run the backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# then fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET

uvicorn main:app --reload --port 8000
```

The API is now at `http://localhost:8000`. Check `http://localhost:8000/docs`
for the interactive Swagger UI, and `http://localhost:8000/health`.

## 3. Run the frontend (Next.js)

```bash
cd frontend
npm install

cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# (NEXT_PUBLIC_API_BASE_URL defaults to http://localhost:8000)

npm run dev
```

Open `http://localhost:3000`.

> The frontend falls back to built-in seed content (`frontend/lib/mock-data.ts`)
> if the backend isn't running yet, so the UI never looks broken — but for
> real data (and for sign-up/sign-in to work), both the backend and Supabase
> need to be configured.

## Design notes

The visual identity is a "case-file / dossier" language: paper background,
navy + amber (wax-seal) accent, a serif display face for headings, and a
monospace face for metadata (dates, publishers, source types) — evoking an
evidence log rather than a generic SaaS template. The signature UI element is
the **verification stamp** (`components/verification-stamp.tsx`), used
everywhere a claim or source needs a status: Verified / Reported / Disputed /
Unconfirmed. It deliberately never implies legal proof — see the disclaimer
on every Situation detail page.

## What's next (Phase 2 candidates)

- Legal Research Hub (treaty/jurisprudence search, ICRC IHL database links)
- Live Data Layer (OHCHR Universal Human Rights Index API integration)
- Source Matrix backed by real per-claim data instead of the current demo rows
- Open Voice (public forum with labelled post types)
- Research Workspace (projects, annotations, peer review)
- Policy Lab (structured proposal template + brief generation)
- Learn (courses/explainers)

Just tell me which one to build next and I'll extend this same codebase.
