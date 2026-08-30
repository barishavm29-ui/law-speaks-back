import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Files,
  Gavel,
  GraduationCap,
  ScrollText,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SituationCard } from "@/components/situation-card";
import { VerificationStamp } from "@/components/verification-stamp";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { MOCK_EVIDENCE, MOCK_SITUATIONS } from "@/lib/mock-data";
import type { EvidenceItem, Situation } from "@/lib/types";

async function getHomeData(): Promise<{ situations: Situation[]; evidence: EvidenceItem[] }> {
  try {
    const situations = await api.situations.list();
    const evidence = await api.evidence.list();
    return { situations: situations.slice(0, 3), evidence: evidence.slice(0, 4) };
  } catch {
    // Backend not running yet — show seed content so the page never looks broken.
    return { situations: MOCK_SITUATIONS, evidence: MOCK_EVIDENCE };
  }
}

export default async function HomePage() {
  const { situations, evidence } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container grid gap-12 py-20 md:grid-cols-[1.15fr_0.85fr] md:py-28">
          <div className="flex flex-col justify-center">
            <span className="case-number font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Research · Evidence · Debate · Policy · Open Voice
            </span>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
              The law doesn&rsquo;t only get written.
              <span className="text-accent"> It gets spoken back to.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              A research platform for International Humanitarian Law and
              International Human Rights Law — connecting live evidence,
              legal frameworks, journalism and public voice, without
              collapsing the line between allegation and proof.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/situations">
                  Enter the Observatory <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/evidence">Browse the Evidence Room</Link>
              </Button>
            </div>
            <p className="mt-6 max-w-lg text-xs text-muted-foreground">
              A listing on this platform is a subject of research, not a
              finding of fact. Every item carries a verification stamp and a
              source trail.
            </p>
          </div>

          {/* Live situations panel — the hero's characteristic artifact */}
          <div className="relative">
            <div className="flex items-center justify-between px-1 pb-3">
              <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <Compass className="size-3.5" /> Live situations
              </h2>
              <Link href="/situations" className="text-xs text-accent hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {situations.map((s) => (
                <Card key={s.id} className="animate-fade-up">
                  <Link href={`/situations/${s.slug}`} className="focus-ring block p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-snug">{s.title}</p>
                      <VerificationStamp status={s.status} size="sm" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {s.country} · updated {formatDate(s.updated_at)} · {s.evidence_count} sources
                    </p>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research question of the day */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="container flex flex-col items-start gap-4 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60">
              Research question of the day
            </span>
            <p className="mt-3 font-display text-2xl font-medium leading-snug md:text-3xl">
              When does restricting humanitarian access itself become a
              breach of the obligation to allow relief operations?
            </p>
          </div>
          <Button asChild variant="accent" size="lg" className="shrink-0">
            <Link href="/research">
              Investigate this <Search className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Latest evidence */}
      <section className="border-b border-border">
        <div className="container py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
                <Files className="size-5 text-accent" strokeWidth={1.75} />
                Latest evidence
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                New documents, datasets and verified open-source material.
              </p>
            </div>
            <Link href="/evidence" className="shrink-0 text-sm text-accent hover:underline">
              Open Evidence Room →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {evidence.map((item) => (
              <Card key={item.id} className="flex flex-col justify-between">
                <CardContent className="pt-5">
                  <VerificationStamp status={item.verification_status} size="sm" />
                  <p className="mt-3 text-sm font-medium leading-snug">{item.title}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {item.publisher} · {formatDate(item.published_on)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Lab + Learn */}
      <section className="container grid gap-6 py-16 md:grid-cols-2">
        <Card className="flex flex-col justify-between p-2">
          <CardContent className="pt-5">
            <Gavel className="size-6 text-accent" strokeWidth={1.75} />
            <h3 className="mt-4 font-display text-xl font-semibold">Policy Lab</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Current proposals moving through research, legal and community
              review — problem, evidence, legal basis, implementation
              pathway, and measurable indicators.
            </p>
            <Button asChild variant="link" className="mt-3 h-auto p-0">
              <Link href="/policy-lab">
                Review proposals <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between p-2">
          <CardContent className="pt-5">
            <GraduationCap className="size-6 text-accent" strokeWidth={1.75} />
            <h3 className="mt-4 font-display text-xl font-semibold">Learn</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Short courses and explainers for people entering IHL/IHRL
              research — from reading a treaty to running a source matrix.
            </p>
            <Button asChild variant="link" className="mt-3 h-auto p-0">
              <Link href="/learn">
                Start learning <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center gap-3 py-16 text-center">
          <ScrollText className="size-6 text-accent" strokeWidth={1.75} />
          <p className="max-w-xl font-display text-xl italic">
            &ldquo;The law isn&rsquo;t finished until you speak.&rdquo;
          </p>
          <Button asChild variant="accent" className="mt-2">
            <Link href="/forum">Enter Open Voice</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
