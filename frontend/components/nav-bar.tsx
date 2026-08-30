import Link from "next/link";
import { Scale, FolderSearch, Files, Landmark, Users, GraduationCap, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/situations", label: "Observatory", icon: FolderSearch },
  { href: "/evidence", label: "Evidence Room", icon: Files },
  { href: "/legal-hub", label: "Legal Hub", icon: Landmark },
  { href: "/forum", label: "Open Voice", icon: Users },
  { href: "/workspace", label: "Workspace", icon: FolderKanban },
  { href: "/learn", label: "Learn", icon: GraduationCap },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-sm">
          <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <Scale className="size-4.5" strokeWidth={2} />
          </span>
          <span className="font-display text-[15px] font-semibold leading-tight tracking-tight">
            The Law
            <br className="hidden sm:block" /> Speaks Back
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-ring"
            >
              <link.icon className="size-4" strokeWidth={1.75} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="accent" size="sm">
            <Link href="/signup">Join the research</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
