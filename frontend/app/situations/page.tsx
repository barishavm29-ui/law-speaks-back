import { FolderSearch } from "lucide-react";
import { SituationCard } from "@/components/situation-card";
import { api } from "@/lib/api";
import { MOCK_SITUATIONS } from "@/lib/mock-data";
import type { Situation } from "@/lib/types";

async function getSituations(): Promise<Situation[]> {
  try {
    return await api.situations.list();
  } catch {
    return MOCK_SITUATIONS;
  }
}

export default async function SituationsPage() {
  const situations = await getSituations();

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <FolderSearch className="size-3.5" /> Situation Observatory
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Situations under active research
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Each entry is a dedicated research page — timeline, geography,
          actors, legal frameworks and open questions. A listing here does
          not mean an allegation is proven.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {situations.map((s) => (
          <SituationCard key={s.id} situation={s} />
        ))}
      </div>
    </div>
  );
}
