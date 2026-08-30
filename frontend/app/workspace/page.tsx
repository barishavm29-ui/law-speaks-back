"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, Plus, LoaderCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import type { WorkspaceProject } from "@/lib/types";

const STATUS_STYLE: Record<string, string> = {
  draft: "border-muted-foreground/30 text-muted-foreground",
  active: "border-accent/40 text-accent",
  published: "border-verified/40 text-verified",
};

export default function WorkspacePage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token;
      setSignedIn(!!token);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const result = await api.workspace.listProjects(token);
        setProjects(result);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-14">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <FolderKanban className="size-3.5" /> Research Workspace
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Your research projects
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Define a question, collect sources, and build toward a working
            paper other researchers can peer-review. Projects here are
            private to you.
          </p>
        </div>
        {signedIn && (
          <Button asChild variant="accent" className="shrink-0">
            <Link href="/workspace/new">
              <Plus className="size-4" /> New project
            </Link>
          </Button>
        )}
      </div>

      {signedIn === false && (
        <Card className="mt-10">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to create and view your research projects.
            </p>
            <Button asChild variant="accent">
              <Link href="/login">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && signedIn && (
        <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" /> Loading your projects…
        </div>
      )}

      {!loading && signedIn && projects.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">
          No projects yet. Start your first one.
        </p>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link key={p.id} href={`/workspace/${p.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="pt-5">
                <Badge variant="outline" className={`font-mono text-[10px] ${STATUS_STYLE[p.status]}`}>
                  {p.status}
                </Badge>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.research_question}</p>
                <p className="mt-3 text-xs text-muted-foreground">Updated {formatDate(p.updated_at)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
