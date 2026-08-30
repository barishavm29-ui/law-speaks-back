-- The Law Speaks Back — Supabase schema (Phase 1)
-- Run this in the Supabase SQL Editor for your project.

create extension if not exists "pgcrypto";

-- ── Situations (Situation Observatory) ──────────────────────────────────
create table if not exists situations (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  region          text not null,
  country         text not null,
  summary         text not null,
  status          text not null default 'unconfirmed'
                    check (status in ('verified', 'reported', 'disputed', 'unconfirmed')),
  legal_frameworks text[] not null default '{}',
  actors          text[] not null default '{}',
  started_on      date not null,
  updated_at      timestamptz not null default now(),
  evidence_count  integer not null default 0,
  open_questions  text[] not null default '{}',
  created_by      uuid references auth.users(id),
  created_at      timestamptz not null default now()
);

create index if not exists situations_status_idx on situations(status);
create index if not exists situations_updated_at_idx on situations(updated_at desc);

-- ── Evidence Room ────────────────────────────────────────────────────────
create table if not exists evidence_items (
  id                  uuid primary key default gen_random_uuid(),
  situation_id        uuid not null references situations(id) on delete cascade,
  title               text not null,
  source_type         text not null check (source_type in (
                        'official_statement', 'local_journalism', 'international_journalism',
                        'ngo_documentation', 'eyewitness', 'open_source', 'legal_finding', 'academic'
                      )),
  publisher           text not null,
  author              text,
  published_on        date not null,
  collected_on        date,
  url                 text,
  media_type          text not null check (media_type in (
                        'document', 'image', 'video', 'dataset', 'article', 'testimony'
                      )),
  language            text not null default 'English',
  verification_status text not null default 'unconfirmed'
                        check (verification_status in ('verified', 'reported', 'disputed', 'unconfirmed')),
  context             text not null,
  limitations          text,
  access_restricted    boolean not null default false,
  created_by           uuid references auth.users(id),
  created_at           timestamptz not null default now()
);

create index if not exists evidence_situation_idx on evidence_items(situation_id);
create index if not exists evidence_source_type_idx on evidence_items(source_type);
create index if not exists evidence_published_on_idx on evidence_items(published_on desc);

-- Auto-update situations.updated_at whenever the situation row changes.
create or replace function touch_situation_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists situations_touch_updated_at on situations;
create trigger situations_touch_updated_at
  before update on situations
  for each row execute function touch_situation_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────
-- The FastAPI backend uses the service-role key (bypasses RLS) for the
-- endpoints in this repo. These policies matter once you query Supabase
-- directly from the client (e.g. future Research Workspace / Forum features).

alter table situations enable row level security;
alter table evidence_items enable row level security;

drop policy if exists "situations are publicly readable" on situations;
create policy "situations are publicly readable"
  on situations for select
  using (true);

drop policy if exists "authenticated users can create situations" on situations;
create policy "authenticated users can create situations"
  on situations for insert
  to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "evidence is publicly readable, restricted rows excluded" on evidence_items;
create policy "evidence is publicly readable, restricted rows excluded"
  on evidence_items for select
  using (access_restricted = false or auth.role() = 'authenticated');

drop policy if exists "authenticated users can add evidence" on evidence_items;
create policy "authenticated users can add evidence"
  on evidence_items for insert
  to authenticated
  with check (auth.uid() = created_by);

-- ── Seed data (optional — mirrors frontend/lib/mock-data.ts) ────────────
insert into situations (slug, title, region, country, summary, status, legal_frameworks, actors, started_on, open_questions)
values
  ('northern-corridor-displacement',
   'Displacement and access restrictions along the Northern Corridor',
   'West Africa', 'Sahel region',
   'Escalating restrictions on humanitarian access are being documented alongside reports of civilian displacement. Multiple sourcing streams are being cross-checked before firmer conclusions are drawn.',
   'reported', array['IHL','IHRL'], array['State armed forces','Non-state armed group','Humanitarian agencies'],
   '2026-02-11',
   array['Do the access restrictions meet the threshold of a proportionality violation under IHL?','What is the verified scale of secondary displacement?']
  ),
  ('port-city-detention-review',
   'Judicial review of mass detention practices in a port city',
   'South Asia', 'Coastal district, undisclosed',
   'A domestic court is reviewing detention practices following NGO documentation and eyewitness testimony. Legal analysts are mapping the case against IHRL fair-trial standards.',
   'verified', array['IHRL','Domestic'], array['Domestic judiciary','Local police','Detainees'' legal counsel'],
   '2025-11-02',
   array['Were detainees afforded access to counsel within domestic statutory timelines?']
  ),
  ('cross-border-shelling-incident',
   'Cross-border shelling incident near a populated market area',
   'Eastern Europe', 'Border region, undisclosed',
   'Open-source geolocation and local journalism are being triangulated to establish the sequence of events. Competing official statements dispute attribution.',
   'disputed', array['IHL'], array['State A armed forces','State B armed forces','Civilian population'],
   '2026-06-30',
   array['Which party''s ordnance is consistent with the crater analysis?','Was the market a known civilian object at the time of the strike?']
  )
on conflict (slug) do nothing;

-- Keep situation evidence counts in sync whenever evidence rows change.
create or replace function sync_situation_evidence_count()
returns trigger as $$
begin
  if tg_op = 'DELETE' then
    update situations
      set evidence_count = (
        select count(*)
        from evidence_items
        where situation_id = old.situation_id
      )
      where id = old.situation_id;
    return old;
  elsif tg_op = 'UPDATE' then
    if new.situation_id is distinct from old.situation_id then
      update situations
        set evidence_count = (
          select count(*)
          from evidence_items
          where situation_id = old.situation_id
        )
        where id = old.situation_id;
    end if;
    update situations
      set evidence_count = (
        select count(*)
        from evidence_items
        where situation_id = new.situation_id
      )
      where id = new.situation_id;
    return new;
  else
    update situations
      set evidence_count = (
        select count(*)
        from evidence_items
        where situation_id = new.situation_id
      )
      where id = new.situation_id;
    return new;
  end if;
end;
$$ language plpgsql;

drop trigger if exists evidence_items_sync_situation_count on evidence_items;
create trigger evidence_items_sync_situation_count
  after insert or update or delete on evidence_items
  for each row execute function sync_situation_evidence_count();

-- Seed a small evidence set so the Evidence Room and homepage are populated.
insert into evidence_items (
  id, situation_id, title, source_type, publisher, author, published_on,
  collected_on, url, media_type, language, verification_status, context,
  limitations, access_restricted
)
values
  (
    '00000000-0000-0000-0000-000000002001',
    (select id from situations where slug = 'northern-corridor-displacement'),
    'OCHA situation report on access constraints, week 33',
    'official_statement',
    'UN OCHA',
    null,
    '2026-08-15',
    '2026-08-16',
    'https://reliefweb.int',
    'document',
    'English',
    'verified',
    'Weekly humanitarian access snapshot covering the affected districts.',
    'Figures are agency estimates pending independent verification.',
    false
  ),
  (
    '00000000-0000-0000-0000-000000002002',
    (select id from situations where slug = 'northern-corridor-displacement'),
    'Satellite imagery comparison, displacement camp expansion',
    'open_source',
    'Independent OSINT researcher network',
    'Verified contributor #A47',
    '2026-08-10',
    '2026-08-12',
    null,
    'image',
    'N/A',
    'reported',
    'Before/after imagery suggesting camp footprint growth of roughly 40%.',
    'Commercial imagery resolution limits precise headcount estimates.',
    false
  ),
  (
    '00000000-0000-0000-0000-000000002003',
    (select id from situations where slug = 'port-city-detention-review'),
    'Court filing excerpt on detention timelines',
    'legal_finding',
    'Domestic court registry',
    'Court clerk extract',
    '2026-08-05',
    '2026-08-06',
    null,
    'document',
    'English',
    'verified',
    'Extract from the hearing bundle showing the detention timeline under review.',
    'Only a partial filing set was available at collection time.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000002004',
    (select id from situations where slug = 'cross-border-shelling-incident'),
    'Local newspaper report on shelling near the market',
    'international_journalism',
    'Regional news desk',
    'Investigative staff',
    '2026-07-01',
    '2026-07-01',
    'https://example.com/report',
    'article',
    'English',
    'reported',
    'Field report covering witness accounts and the immediate aftermath of the strike.',
    'Attribution remains contested and relies on preliminary witness statements.',
    false
  )
on conflict (id) do nothing;

update situations s
set evidence_count = coalesce((
  select count(*)
  from evidence_items e
  where e.situation_id = s.id
), 0);

-- ── Phase 2: Open Voice, Policy Lab, Legal Hub, Learn, Research Workspace ─

create table if not exists forum_posts (
  id                uuid primary key default gen_random_uuid(),
  situation_id      uuid references situations(id) on delete set null,
  author_id         uuid references auth.users(id),
  author_name       text not null,
  label             text not null check (label in (
                      'Opinion', 'Factual Claim', 'Legal Analysis',
                      'Question', 'Research Finding', 'Policy Proposal'
                    )),
  title             text not null,
  body              text not null,
  sources_attached  integer not null default 0,
  challenges        integer not null default 0,
  created_at        timestamptz not null default now()
);

create index if not exists forum_posts_situation_idx on forum_posts(situation_id);
create index if not exists forum_posts_created_at_idx on forum_posts(created_at desc);

create table if not exists policy_proposals (
  id                      uuid primary key default gen_random_uuid(),
  title                   text not null,
  problem                 text not null,
  evidence_summary        text not null,
  legal_basis             text not null,
  affected_stakeholders   text[] not null default '{}',
  proposed_intervention   text not null,
  implementation_pathway  text not null,
  risks                   text not null,
  resource_implications   text not null,
  measurable_indicators   text[] not null default '{}',
  stage                   text not null default 'problem' check (stage in (
                            'problem', 'evidence', 'legal_basis',
                            'community_review', 'institutional_review'
                          )),
  created_by              uuid references auth.users(id),
  updated_at              timestamptz not null default now()
);

create table if not exists legal_documents (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null check (category in (
                  'Treaty', 'Customary IHL', 'Jurisprudence', 'UN Material', 'Commentary'
                )),
  jurisdiction  text not null,
  year          integer not null,
  summary       text not null,
  external_url  text
);

create table if not exists courses (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  level             text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  duration_minutes  integer not null,
  description       text not null,
  modules           text[] not null default '{}'
);

create table if not exists workspace_projects (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  research_question  text not null,
  methodology        text,
  status             text not null default 'draft' check (status in ('draft', 'active', 'published')),
  owner_id           uuid not null references auth.users(id),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists workspace_sources (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references workspace_projects(id) on delete cascade,
  title       text not null,
  url         text,
  note        text,
  added_at    timestamptz not null default now()
);

create index if not exists workspace_sources_project_idx on workspace_sources(project_id);

-- RLS
alter table forum_posts enable row level security;
alter table policy_proposals enable row level security;
alter table legal_documents enable row level security;
alter table courses enable row level security;
alter table workspace_projects enable row level security;
alter table workspace_sources enable row level security;

drop policy if exists "forum posts are publicly readable" on forum_posts;
create policy "forum posts are publicly readable" on forum_posts for select using (true);
drop policy if exists "authenticated users can post" on forum_posts;
create policy "authenticated users can post" on forum_posts for insert to authenticated with check (auth.uid() = author_id);

drop policy if exists "policy proposals are publicly readable" on policy_proposals;
create policy "policy proposals are publicly readable" on policy_proposals for select using (true);
drop policy if exists "authenticated users can propose" on policy_proposals;
create policy "authenticated users can propose" on policy_proposals for insert to authenticated with check (auth.uid() = created_by);

drop policy if exists "legal documents are publicly readable" on legal_documents;
create policy "legal documents are publicly readable" on legal_documents for select using (true);
drop policy if exists "courses are publicly readable" on courses;
create policy "courses are publicly readable" on courses for select using (true);

drop policy if exists "owners can read their projects" on workspace_projects;
create policy "owners can read their projects" on workspace_projects for select to authenticated using (auth.uid() = owner_id);
drop policy if exists "authenticated users can create projects" on workspace_projects;
create policy "authenticated users can create projects" on workspace_projects for insert to authenticated with check (auth.uid() = owner_id);
drop policy if exists "owners can update their projects" on workspace_projects;
create policy "owners can update their projects" on workspace_projects for update to authenticated using (auth.uid() = owner_id);

drop policy if exists "owners can read their sources" on workspace_sources;
create policy "owners can read their sources" on workspace_sources for select to authenticated using (
  exists (select 1 from workspace_projects p where p.id = project_id and p.owner_id = auth.uid())
);
drop policy if exists "owners can add sources" on workspace_sources;
create policy "owners can add sources" on workspace_sources for insert to authenticated with check (
  exists (select 1 from workspace_projects p where p.id = project_id and p.owner_id = auth.uid())
);

-- Seed: legal documents & courses (safe to re-run)
insert into legal_documents (title, category, jurisdiction, year, summary, external_url) values
  ('Geneva Convention IV Relative to the Protection of Civilian Persons in Time of War', 'Treaty', 'International', 1949, 'Core treaty protecting civilians, including those under occupation, from the effects of armed conflict.', 'https://ihl-databases.icrc.org'),
  ('ICRC Customary IHL Database — Rule 55: Access for Humanitarian Relief', 'Customary IHL', 'International', 2005, 'Codifies the customary rule requiring parties to allow and facilitate rapid, unimpeded humanitarian relief.', 'https://ihl-databases.icrc.org/customary-ihl'),
  ('International Criminal Court, Situation in the Central African Republic II', 'Jurisprudence', 'ICC', 2021, 'Judicial findings relevant to command responsibility standards applied in comparable displacement cases.', 'https://www.icc-cpi.int'),
  ('OHCHR Universal Periodic Review — Country Recommendations Digest', 'UN Material', 'International', 2026, 'Aggregated Treaty Body and Special Procedures recommendations relevant to detention practice.', 'https://uhri.ohchr.org')
on conflict do nothing;

insert into courses (title, level, duration_minutes, description, modules) values
  ('Reading a treaty like a researcher', 'Beginner', 25, 'How to navigate treaty text, reservations, and commentary without a law degree.', array['Treaty structure','Reservations & declarations','Where to find authoritative commentary']),
  ('Running a source matrix', 'Intermediate', 35, 'How to compare official, journalistic, NGO and open-source material on the same claim.', array['Categorising sources','Spotting contradiction vs. uncertainty','Documenting your matrix']),
  ('Open-source verification basics', 'Beginner', 30, 'An introduction to the Berkeley Protocol''s approach to digital open-source investigation.', array['Collection & preservation','Chain of custody','Investigator and source safety'])
on conflict do nothing;
