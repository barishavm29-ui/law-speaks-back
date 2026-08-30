import type {
  Course,
  EvidenceItem,
  ForumPost,
  LegalDocument,
  PolicyProposal,
  Situation,
} from "@/lib/types";

// Used only as a client-side/server-side fallback when the FastAPI backend
// is unreachable (e.g. first run before the backend is started), so the UI
// is never blank. Once /backend is running against Supabase, live data
// takes over automatically — see lib/api.ts.

export const MOCK_SITUATIONS: Situation[] = [
  {
    id: "sit_001",
    slug: "northern-corridor-displacement",
    title: "Displacement and access restrictions along the Northern Corridor",
    region: "West Africa",
    country: "Sahel region",
    summary:
      "Escalating restrictions on humanitarian access are being documented alongside reports of civilian displacement. Multiple sourcing streams are being cross-checked before firmer conclusions are drawn.",
    status: "reported",
    legal_frameworks: ["IHL", "IHRL"],
    actors: ["State armed forces", "Non-state armed group", "Humanitarian agencies"],
    started_on: "2026-02-11",
    updated_at: "2026-08-18",
    evidence_count: 34,
    open_questions: [
      "Do the access restrictions meet the threshold of a proportionality violation under IHL?",
      "What is the verified scale of secondary displacement?",
    ],
  },
  {
    id: "sit_002",
    slug: "port-city-detention-review",
    title: "Judicial review of mass detention practices in a port city",
    region: "South Asia",
    country: "Coastal district, undisclosed",
    summary:
      "A domestic court is reviewing detention practices following NGO documentation and eyewitness testimony. Legal analysts are mapping the case against IHRL fair-trial standards.",
    status: "verified",
    legal_frameworks: ["IHRL", "Domestic"],
    actors: ["Domestic judiciary", "Local police", "Detainees' legal counsel"],
    started_on: "2025-11-02",
    updated_at: "2026-08-20",
    evidence_count: 58,
    open_questions: [
      "Were detainees afforded access to counsel within domestic statutory timelines?",
    ],
  },
  {
    id: "sit_003",
    slug: "cross-border-shelling-incident",
    title: "Cross-border shelling incident near a populated market area",
    region: "Eastern Europe",
    country: "Border region, undisclosed",
    summary:
      "Open-source geolocation and local journalism are being triangulated to establish the sequence of events. Competing official statements dispute attribution.",
    status: "disputed",
    legal_frameworks: ["IHL"],
    actors: ["State A armed forces", "State B armed forces", "Civilian population"],
    started_on: "2026-06-30",
    updated_at: "2026-08-21",
    evidence_count: 21,
    open_questions: [
      "Which party's ordnance is consistent with the crater analysis?",
      "Was the market a known civilian object at the time of the strike?",
    ],
  },
];

export const MOCK_EVIDENCE: EvidenceItem[] = [
  {
    id: "ev_1001",
    situation_id: "sit_001",
    title: "OCHA situation report on access constraints, week 33",
    source_type: "official_statement",
    publisher: "UN OCHA",
    author: null,
    published_on: "2026-08-15",
    collected_on: "2026-08-16",
    url: "https://reliefweb.int",
    media_type: "document",
    language: "English",
    verification_status: "verified",
    context: "Weekly humanitarian access snapshot covering the affected districts.",
    limitations: "Figures are agency estimates pending independent verification.",
    access_restricted: false,
  },
  {
    id: "ev_1002",
    situation_id: "sit_001",
    title: "Satellite imagery comparison, displacement camp expansion",
    source_type: "open_source",
    publisher: "Independent OSINT researcher network",
    author: "Verified contributor #A47",
    published_on: "2026-08-10",
    collected_on: "2026-08-12",
    url: null,
    media_type: "image",
    language: "N/A",
    verification_status: "reported",
    context: "Before/after imagery suggesting camp footprint growth of roughly 40%.",
    limitations: "Commercial imagery resolution limits precise headcount estimates.",
    access_restricted: false,
  },
  {
    id: "ev_1003",
    situation_id: "sit_003",
    title: "Crater analysis field report",
    source_type: "ngo_documentation",
    publisher: "International munitions monitoring group",
    author: "Field investigations team",
    published_on: "2026-07-05",
    collected_on: "2026-07-08",
    url: null,
    media_type: "document",
    language: "English",
    verification_status: "disputed",
    context: "Fragmentation pattern analysis from the market site, three days post-incident.",
    limitations: "Site access was delayed, raising chain-of-custody questions on fragments.",
    access_restricted: true,
  },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "post_001",
    situation_slug: "northern-corridor-displacement",
    author_name: "R. Adeyemi",
    label: "Legal Analysis",
    title: "Access restriction may cross the proportionality threshold",
    body: "Looking at the OCHA report timeline against the pattern of denied convoy permits, this reads closer to a deliberate obstruction than an incidental security measure. Worth mapping against API II Art. 18.",
    sources_attached: 2,
    challenges: 1,
    created_at: "2026-08-19T09:30:00Z",
  },
  {
    id: "post_002",
    situation_slug: "cross-border-shelling-incident",
    author_name: "M. Kovalenko",
    label: "Factual Claim",
    title: "Fragmentation pattern is inconsistent with the official statement",
    body: "The NGO field report's fragmentation angles don't match the trajectory claimed in the State A statement. Attaching the full PDF for anyone who wants to cross-check the geometry.",
    sources_attached: 1,
    challenges: 3,
    created_at: "2026-08-20T14:05:00Z",
  },
  {
    id: "post_003",
    situation_slug: null,
    author_name: "T. Lindqvist",
    label: "Question",
    title: "How does the platform handle conflicting eyewitness accounts?",
    body: "New to the platform — is there a standard for how many independent eyewitness accounts are needed before something moves from 'reported' to 'verified'?",
    sources_attached: 0,
    challenges: 0,
    created_at: "2026-08-21T11:12:00Z",
  },
  {
    id: "post_004",
    situation_slug: "port-city-detention-review",
    author_name: "S. Nair",
    label: "Research Finding",
    title: "Detention timelines exceed domestic statutory limits in 6 of 9 cases",
    body: "Cross-referenced the court filings with the domestic criminal procedure code. Six of the nine reviewed detention cases exceeded the 48-hour production-before-magistrate requirement.",
    sources_attached: 4,
    challenges: 0,
    created_at: "2026-08-18T08:00:00Z",
  },
];

export const MOCK_POLICY_PROPOSALS: PolicyProposal[] = [
  {
    id: "policy_001",
    title: "Standardised humanitarian access denial reporting protocol",
    problem:
      "Access denials are recorded inconsistently across agencies, making it difficult to establish patterns that meet the legal threshold for obstruction.",
    evidence_summary:
      "34 documented access incidents in the Northern Corridor situation alone, sourced from OCHA, NGO field reports and satellite imagery.",
    legal_basis:
      "Additional Protocol II, Article 18; customary IHL rule 55 on humanitarian access.",
    affected_stakeholders: ["Humanitarian agencies", "Affected civilian populations", "State authorities"],
    proposed_intervention:
      "A shared, timestamped incident-logging template adopted across agencies operating in the same corridor.",
    implementation_pathway:
      "Pilot with two agencies for one quarter, then propose adoption to the regional humanitarian coordination body.",
    risks: "Agencies may be reluctant to share incident data that could be seen as politically sensitive.",
    resource_implications: "Low — reuses existing reporting staff, requires a shared template and light coordination.",
    measurable_indicators: ["% of incidents cross-logged within 48 hours", "Reduction in duplicate/conflicting incident reports"],
    stage: "community_review",
    updated_at: "2026-08-15T00:00:00Z",
  },
  {
    id: "policy_002",
    title: "Fast-track legal aid access for prolonged pre-trial detention cases",
    problem:
      "Detainees in the port-city cases are frequently held beyond statutory limits before accessing counsel.",
    evidence_summary:
      "Research finding shows 6 of 9 reviewed cases exceeded the 48-hour production requirement.",
    legal_basis: "IHRL fair-trial guarantees; domestic criminal procedure code.",
    affected_stakeholders: ["Detainees", "Domestic judiciary", "Legal aid providers"],
    proposed_intervention: "A duty-counsel roster triggered automatically at the 24-hour mark of detention.",
    implementation_pathway: "Propose to the local bar association and district court administration.",
    risks: "Requires sustained funding for duty counsel; may face institutional resistance.",
    resource_implications: "Moderate — requires a funded roster and coordination with the court registry.",
    measurable_indicators: ["Median time-to-counsel", "% of cases within statutory limit"],
    stage: "evidence",
    updated_at: "2026-08-10T00:00:00Z",
  },
];

export const MOCK_LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "doc_001",
    title: "Geneva Convention IV Relative to the Protection of Civilian Persons in Time of War",
    category: "Treaty",
    jurisdiction: "International",
    year: 1949,
    summary: "Core treaty protecting civilians, including those under occupation, from the effects of armed conflict.",
    external_url: "https://ihl-databases.icrc.org",
  },
  {
    id: "doc_002",
    title: "ICRC Customary IHL Database — Rule 55: Access for Humanitarian Relief",
    category: "Customary IHL",
    jurisdiction: "International",
    year: 2005,
    summary: "Codifies the customary rule requiring parties to allow and facilitate rapid, unimpeded humanitarian relief.",
    external_url: "https://ihl-databases.icrc.org/customary-ihl",
  },
  {
    id: "doc_003",
    title: "International Criminal Court, Situation in the Central African Republic II",
    category: "Jurisprudence",
    jurisdiction: "ICC",
    year: 2021,
    summary: "Judicial findings relevant to command responsibility standards applied in comparable displacement cases.",
    external_url: "https://www.icc-cpi.int",
  },
  {
    id: "doc_004",
    title: "OHCHR Universal Periodic Review — Country Recommendations Digest",
    category: "UN Material",
    jurisdiction: "International",
    year: 2026,
    summary: "Aggregated Treaty Body and Special Procedures recommendations relevant to detention practice.",
    external_url: "https://uhri.ohchr.org",
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: "course_001",
    title: "Reading a treaty like a researcher",
    level: "Beginner",
    duration_minutes: 25,
    description: "How to navigate treaty text, reservations, and commentary without a law degree.",
    modules: ["Treaty structure", "Reservations & declarations", "Where to find authoritative commentary"],
  },
  {
    id: "course_002",
    title: "Running a source matrix",
    level: "Intermediate",
    duration_minutes: 35,
    description: "How to compare official, journalistic, NGO and open-source material on the same claim.",
    modules: ["Categorising sources", "Spotting contradiction vs. uncertainty", "Documenting your matrix"],
  },
  {
    id: "course_003",
    title: "Open-source verification basics",
    level: "Beginner",
    duration_minutes: 30,
    description: "An introduction to the Berkeley Protocol's approach to digital open-source investigation.",
    modules: ["Collection & preservation", "Chain of custody", "Investigator and source safety"],
  },
];
