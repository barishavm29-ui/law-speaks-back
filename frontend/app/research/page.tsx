import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ResearchQuestionPage() {
  return (
    <div className="container max-w-2xl py-14">
      <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <Search className="size-3.5" /> Research question of the day
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-snug tracking-tight">
        When does restricting humanitarian access itself become a breach of
        the obligation to allow relief operations?
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Under IHL, parties to a conflict must allow and facilitate rapid and
        unimpeded passage of humanitarian relief for civilians in need,
        subject to their right of control. The dividing line between a
        legitimate security measure and an unlawful obstruction is drawn
        case-by-case — through the pattern, duration and proportionality of
        the restriction, not any single incident.
      </p>

      <Card className="mt-8">
        <CardContent className="pt-5">
          <h2 className="font-display text-base font-semibold">
            Start investigating
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The Northern Corridor situation is the most active case study for
            this question right now — 34 evidence items and counting.
          </p>
          <Button asChild variant="accent" className="mt-4">
            <Link href="/situations/northern-corridor-displacement">
              Open the situation <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        Have a view? Bring it — with sources — to{" "}
        <Link href="/forum" className="text-accent hover:underline">
          Open Voice
        </Link>
        .
      </p>
    </div>
  );
}
