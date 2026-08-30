import { Lock, EyeOff, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SafetyPage() {
  return (
    <div className="container max-w-2xl py-14">
      <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <ShieldAlert className="size-3.5" /> Standards
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        Source safety
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Some material in the Evidence Room can put an investigator, witness,
        victim, or source at risk if handled carelessly — this page covers
        how the platform limits that risk.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <Card>
          <CardContent className="flex items-start gap-4 pt-5">
            <Lock className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
            <div>
              <h3 className="font-display text-base font-semibold">Access-controlled material</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                High-risk evidence — material that could identify a witness,
                victim, or an ongoing investigation — is flagged
                &ldquo;access-restricted&rdquo; and is only visible to
                signed-in, verified researchers.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-4 pt-5">
            <EyeOff className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
            <div>
              <h3 className="font-display text-base font-semibold">Identity protection</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Eyewitness and testimony material is reviewed for
                identifying details before publication. Contributors can
                request material be withheld or redacted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        This follows the safety considerations set out in the{" "}
        <a href="/berkeley-protocol" className="text-accent hover:underline">
          Berkeley Protocol
        </a>
        . If you believe something on this platform puts someone at risk,
        contact the research team immediately.
      </p>
    </div>
  );
}
