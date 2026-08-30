import { ScanSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PRINCIPLES = [
  { title: "Identify", body: "Systematically locate potentially relevant online material relating to a situation." },
  { title: "Collect", body: "Capture material with metadata and provenance intact, minimizing risk of alteration." },
  { title: "Preserve", body: "Store material securely with a documented chain of custody." },
  { title: "Verify", body: "Cross-check material against independent sources before treating it as reliable." },
  { title: "Analyse", body: "Interpret material in context, distinguishing what it shows from what it's claimed to show." },
  { title: "Present", body: "Communicate findings, including uncertainty and limitations, without overstating confidence." },
];

export default function BerkeleyProtocolPage() {
  return (
    <div className="container max-w-2xl py-14">
      <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <ScanSearch className="size-3.5" /> Open-source investigation
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        The Berkeley Protocol
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        This platform adopts the methodological and ethical principles of
        the Berkeley Protocol on Digital Open Source Investigations when
        handling open-source material — standards for identifying,
        collecting, preserving, analysing and presenting online information
        in investigations concerning international criminal, human-rights
        and humanitarian law.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <Card key={p.title}>
            <CardContent className="pt-5">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-1 font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        The Protocol also sets out safety considerations for investigators,
        witnesses, victims and others — see{" "}
        <a href="/safety" className="text-accent hover:underline">
          Source safety
        </a>{" "}
        for how that applies on this platform.
      </p>
    </div>
  );
}
