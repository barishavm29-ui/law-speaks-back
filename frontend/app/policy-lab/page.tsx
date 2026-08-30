import { Gavel, Users2, AlertTriangle, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { MOCK_POLICY_PROPOSALS } from "@/lib/mock-data";
import type { PolicyProposal, PolicyProposalStage } from "@/lib/types";

const STAGE_LABEL: Record<PolicyProposalStage, string> = {
  problem: "Problem framing",
  evidence: "Evidence review",
  legal_basis: "Legal basis review",
  community_review: "Community review",
  institutional_review: "Institutional review",
};

async function getProposals(): Promise<PolicyProposal[]> {
  try {
    return await api.policy.list();
  } catch {
    return MOCK_POLICY_PROPOSALS;
  }
}

export default async function PolicyLabPage() {
  const proposals = await getProposals();

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Gavel className="size-3.5" /> Policy Lab
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Proposals grounded in the research record
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Every proposal follows the same template: problem → evidence →
          legal basis → affected stakeholders → intervention →
          implementation pathway → risks → resource implications →
          measurable indicators. The platform can draft briefs from research,
          but institutional bodies must independently adopt any proposal.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {proposals.map((p) => (
          <Card key={p.id}>
            <CardContent className="pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="accent" className="font-mono text-[10px]">
                  {STAGE_LABEL[p.stage]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Updated {formatDate(p.updated_at)}
                </span>
              </div>

              <h2 className="mt-3 font-display text-xl font-semibold leading-snug">
                {p.title}
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Problem
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{p.problem}</p>
                </div>
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Evidence
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{p.evidence_summary}</p>
                </div>
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Legal basis
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{p.legal_basis}</p>
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    <Users2 className="size-3.5" /> Affected stakeholders
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.affected_stakeholders.map((s) => (
                      <span key={s} className="rounded-sm border border-border bg-secondary px-2 py-0.5 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-5" />

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Proposed intervention
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{p.proposed_intervention}</p>
                </div>
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Implementation pathway
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{p.implementation_pathway}</p>
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    <AlertTriangle className="size-3.5" /> Risks
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{p.risks}</p>
                </div>
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Resource implications
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{p.resource_implications}</p>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  <Gauge className="size-3.5" /> Measurable indicators
                </h3>
                <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {p.measurable_indicators.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
