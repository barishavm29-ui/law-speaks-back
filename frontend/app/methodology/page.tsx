import { ShieldCheck, CircleAlert, TriangleAlert, CircleHelp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationStamp } from "@/components/verification-stamp";

const STATUSES = [
  {
    status: "verified" as const,
    icon: ShieldCheck,
    description:
      "Corroborated by at least two independent source types (e.g. official documentation and NGO field reporting, or open-source geolocation and eyewitness testimony) with no unresolved contradiction.",
  },
  {
    status: "reported" as const,
    icon: CircleAlert,
    description:
      "Documented by at least one credible source, but not yet independently corroborated. Treated as a lead for further research, not a finding.",
  },
  {
    status: "disputed" as const,
    icon: TriangleAlert,
    description:
      "Multiple sources give materially conflicting accounts of the same claim. The Source Matrix is used to show exactly where the disagreement lies.",
  },
  {
    status: "unconfirmed" as const,
    icon: CircleHelp,
    description:
      "Insufficient sourcing to assess either way. Listed to flag a research gap, not to suggest something is being hidden or true.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="container max-w-2xl py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Verification methodology
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Every situation and evidence item on this platform carries a
        verification stamp. The stamp reflects the current state of
        sourcing — it is never a judicial or legal finding, and it can
        change as new evidence is added.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {STATUSES.map((s) => (
          <Card key={s.status}>
            <CardContent className="flex items-start gap-4 pt-5">
              <VerificationStamp status={s.status} />
              <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Journalism is treated as valuable contemporaneous evidence and
        context — it can lead researchers to documents, witnesses, locations
        and dates — but is never treated as automatically conclusive legal
        proof on its own.
      </p>
    </div>
  );
}
