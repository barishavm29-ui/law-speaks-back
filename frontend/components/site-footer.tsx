import Link from "next/link";
import { Scale } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-base font-semibold">
              <Scale className="size-4.5" strokeWidth={2} />
              The Law Speaks Back
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A research and civic-learning platform for International
              Humanitarian Law and International Human Rights Law.
            </p>
            <p className="mt-4 font-display text-sm italic text-muted-foreground">
              &ldquo;The law isn&apos;t finished until you speak.&rdquo;
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Research
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/situations" className="hover:text-accent">Situation Observatory</Link></li>
              <li><Link href="/evidence" className="hover:text-accent">Evidence Room</Link></li>
              <li><Link href="/legal-hub" className="hover:text-accent">Legal Research Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Participate
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/forum" className="hover:text-accent">Open Voice Forum</Link></li>
              <li><Link href="/policy-lab" className="hover:text-accent">Policy Lab</Link></li>
              <li><Link href="/learn" className="hover:text-accent">Learn</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Standards
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/methodology" className="hover:text-accent">Verification methodology</Link></li>
              <li><Link href="/berkeley-protocol" className="hover:text-accent">Berkeley Protocol</Link></li>
              <li><Link href="/safety" className="hover:text-accent">Source safety</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Law Speaks Back. Listing a situation does not imply proof of any allegation.</p>
          <p>Built for researchers, journalists and the public record.</p>
        </div>
      </div>
    </footer>
  );
}
