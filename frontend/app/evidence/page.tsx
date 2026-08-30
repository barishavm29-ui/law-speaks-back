import { Files, Globe2, Languages, Lock, ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerificationStamp } from "@/components/verification-stamp";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { MOCK_EVIDENCE } from "@/lib/mock-data";
import type { EvidenceItem } from "@/lib/types";

const SOURCE_LABEL: Record<EvidenceItem["source_type"], string> = {
  official_statement: "Official statement",
  local_journalism: "Local journalism",
  international_journalism: "International journalism",
  ngo_documentation: "NGO documentation",
  eyewitness: "Eyewitness material",
  open_source: "Open-source information",
  legal_finding: "Legal finding",
  academic: "Academic analysis",
};

async function getEvidence(): Promise<EvidenceItem[]> {
  try {
    return await api.evidence.list();
  } catch {
    return MOCK_EVIDENCE;
  }
}

export default async function EvidencePage() {
  const evidence = await getEvidence();

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Files className="size-3.5" /> Evidence Room
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          The structured evidence layer
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Every item records its source, provenance, collection date,
          language, verification status and known limitations. High-risk
          material is access-controlled.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {evidence.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col gap-4 pt-5 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <VerificationStamp status={item.verification_status} size="sm" />
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {SOURCE_LABEL[item.source_type]}
                  </Badge>
                  {item.access_restricted && (
                    <Badge variant="outline" className="flex items-center gap-1 font-mono text-[10px]">
                      <Lock className="size-3" /> Access-restricted
                    </Badge>
                  )}
                </div>

                <p className="mt-3 font-display text-base font-semibold leading-snug">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.context}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ScrollText className="size-3.5" /> {item.publisher}
                  </span>
                  <span>Published {formatDate(item.published_on)}</span>
                  {item.collected_on && <span>Collected {formatDate(item.collected_on)}</span>}
                  <span className="flex items-center gap-1">
                    <Languages className="size-3.5" /> {item.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe2 className="size-3.5" /> {item.media_type}
                  </span>
                </div>

                {item.limitations && (
                  <p className="mt-3 text-xs italic text-muted-foreground">
                    Known limitations: {item.limitations}
                  </p>
                )}
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 self-start rounded-sm border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary focus-ring"
                >
                  Open source ↗
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
