import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users2, ScaleIcon, CircleHelp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerificationStamp } from "@/components/verification-stamp";
import { SourceMatrix } from "@/components/source-matrix";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { MOCK_EVIDENCE, MOCK_SITUATIONS } from "@/lib/mock-data";
import type { EvidenceItem, Situation } from "@/lib/types";

async function getSituation(slug: string): Promise<Situation | null> {
  try {
    return await api.situations.get(slug);
  } catch {
    return MOCK_SITUATIONS.find((s) => s.slug === slug) ?? null;
  }
}

async function getEvidence(situationId: string): Promise<EvidenceItem[]> {
  try {
    return await api.evidence.listBySituation(situationId);
  } catch {
    return MOCK_EVIDENCE.filter((e) => e.situation_id === situationId);
  }
}

export default async function SituationDetailPage({ params }: { params: { id: string } }) {
  const situation = await getSituation(params.id);
  if (!situation) notFound();

  const evidence = await getEvidence(situation.id);

  // Demonstration source matrix derived from the situation's open questions.
  const matrixRows = situation.open_questions.map((claim) => ({
    claim,
    positions: {
      official_statement: "unclear" as const,
      local_journalism: "supports" as const,
      international_journalism: "unclear" as const,
      ngo_documentation: "supports" as const,
      eyewitness: "supports" as const,
      open_source: "unclear" as const,
      legal_finding: "silent" as const,
    },
  }));

  return (
    <div className="container py-14">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {situation.country} · {situation.region}
          <span className="text-border">|</span>
          <CalendarDays className="size-3.5" /> Opened {formatDate(situation.started_on)}
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {situation.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <VerificationStamp status={situation.status} />
          {situation.legal_frameworks.map((fw) => (
            <Badge key={fw} variant="outline" className="font-mono text-[10px]">
              {fw}
            </Badge>
          ))}
        </div>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {situation.summary}
        </p>
      </div>

      {/* Actors */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <Users2 className="size-4 text-muted-foreground" strokeWidth={1.75} />
        {situation.actors.map((actor) => (
          <span key={actor} className="rounded-sm border border-border bg-secondary px-2 py-1 text-xs">
            {actor}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="evidence" className="mt-10">
        <TabsList>
          <TabsTrigger value="evidence">Evidence ({evidence.length})</TabsTrigger>
          <TabsTrigger value="matrix">Source Matrix</TabsTrigger>
          <TabsTrigger value="questions">Open Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="evidence">
          {evidence.length === 0 ? (
            <p className="py-10 text-sm text-muted-foreground">
              No evidence has been catalogued for this situation yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {evidence.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <VerificationStamp status={item.verification_status} size="sm" />
                      {item.access_restricted && (
                        <Badge variant="outline" className="font-mono text-[10px]">
                          Access-restricted
                        </Badge>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-medium leading-snug">{item.title}</p>
                    <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      {item.publisher} · {formatDate(item.published_on)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.context}</p>
                    {item.limitations && (
                      <p className="mt-2 text-xs italic text-muted-foreground">
                        Limitation: {item.limitations}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matrix">
          <SourceMatrix rows={matrixRows} />
          <p className="mt-3 text-xs text-muted-foreground">
            This matrix shows agreement, contradiction and uncertainty across
            source types — it is not a legal conclusion.
          </p>
        </TabsContent>

        <TabsContent value="questions">
          <ul className="space-y-3">
            {situation.open_questions.map((q, idx) => (
              <li key={idx} className="flex gap-3 rounded-md border border-border bg-card p-4">
                <CircleHelp className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                <span className="text-sm leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>

      <div className="mt-14 flex items-start gap-3 rounded-md border border-border bg-secondary/40 p-5">
        <ScaleIcon className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
        <p className="text-sm text-muted-foreground">
          Being listed on The Law Speaks Back does not imply that any
          allegation described here has been proven. Verification stamps
          reflect the current state of sourcing, not a judicial finding.
        </p>
      </div>
    </div>
  );
}
