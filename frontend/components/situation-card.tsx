import Link from "next/link";
import { ArrowUpRight, FileText, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { VerificationStamp } from "@/components/verification-stamp";
import { formatDate } from "@/lib/utils";
import type { Situation } from "@/lib/types";

export function SituationCard({ situation }: { situation: Situation }) {
  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/situations/${situation.slug}`} className="focus-ring block p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" strokeWidth={1.75} />
            {situation.country} · {situation.region}
          </div>
          <VerificationStamp status={situation.status} size="sm" />
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-accent">
          {situation.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {situation.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {situation.legal_frameworks.map((fw) => (
            <span
              key={fw}
              className="rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
            >
              {fw}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="size-3.5" strokeWidth={1.75} />
            {situation.evidence_count} evidence items
          </span>
          <span className="flex items-center gap-1">
            Updated {formatDate(situation.updated_at)}
            <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
          </span>
        </div>
      </Link>
    </Card>
  );
}
