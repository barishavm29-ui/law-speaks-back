import { Landmark, ExternalLink, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { MOCK_LEGAL_DOCUMENTS } from "@/lib/mock-data";
import type { LegalDocument } from "@/lib/types";

const CATEGORY_STYLE: Record<string, string> = {
  Treaty: "border-primary/30 text-primary",
  "Customary IHL": "border-accent/40 text-accent",
  Jurisprudence: "border-verified/40 text-verified",
  "UN Material": "border-pending/40 text-pending",
  Commentary: "border-muted-foreground/30 text-muted-foreground",
};

async function getDocuments(): Promise<LegalDocument[]> {
  try {
    return await api.legal.list();
  } catch {
    return MOCK_LEGAL_DOCUMENTS;
  }
}

export default async function LegalHubPage() {
  const documents = await getDocuments();

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Landmark className="size-3.5" /> Legal Research Hub
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Treaties, jurisprudence and legal commentary
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This hub connects to authoritative external databases — the ICRC&rsquo;s
          IHL Databases already cover treaties, customary IHL and national
          implementation — rather than duplicating them. Entries below are a
          starting index; click through for the full source.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="flex flex-col gap-3 pt-5 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <Badge
                  variant="outline"
                  className={`font-mono text-[10px] ${CATEGORY_STYLE[doc.category] ?? ""}`}
                >
                  {doc.category}
                </Badge>
                <p className="mt-3 font-display text-base font-semibold leading-snug">
                  {doc.title}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {doc.jurisdiction} · {doc.year}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{doc.summary}</p>
              </div>
              {doc.external_url && (
                <a
                  href={doc.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1.5 self-start rounded-sm border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary focus-ring"
                >
                  Open source <ExternalLink className="size-3.5" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex items-start gap-3 rounded-md border border-border bg-secondary/40 p-5">
        <Scale className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
        <p className="text-sm text-muted-foreground">
          This index links to primary and authoritative secondary sources; it
          is not itself a substitute for reading the treaty text, judgment,
          or commentary in full.
        </p>
      </div>
    </div>
  );
}
