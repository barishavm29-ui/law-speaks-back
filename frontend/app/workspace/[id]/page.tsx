"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FolderKanban, Plus, LoaderCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import type { WorkspaceProject, WorkspaceSource } from "@/lib/types";

export default function WorkspaceProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();

  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [sources, setSources] = useState<WorkspaceSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const accessToken = data.session?.access_token;
      if (!accessToken) {
        setError("Please sign in to view this project.");
        setLoading(false);
        return;
      }
      setToken(accessToken);
      try {
        const [p, s] = await Promise.all([
          api.workspace.getProject(params.id, accessToken),
          api.workspace.listSources(params.id, accessToken),
        ]);
        setProject(p);
        setSources(s);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load this project.");
      } finally {
        setLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleAddSource(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setAdding(true);
    try {
      const source = await api.workspace.addSource(
        params.id,
        { title: sourceTitle, url: sourceUrl || undefined, note: sourceNote || undefined },
        token
      );
      setSources((prev) => [source, ...prev]);
      setSourceTitle("");
      setSourceUrl("");
      setSourceNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add source.");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center gap-2 py-14 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin" /> Loading project…
      </div>
    );
  }

  if (error || !project) {
    return <div className="container py-14 text-sm text-destructive">{error ?? "Project not found."}</div>;
  }

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <FolderKanban className="size-3.5" /> Research Workspace
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">{project.title}</h1>
        <Badge variant="outline" className="mt-3 font-mono text-[10px]">
          {project.status}
        </Badge>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{project.research_question}</p>
        {project.methodology && (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-mono text-[11px] uppercase tracking-wide">Methodology: </span>
            {project.methodology}
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardContent className="pt-5">
            <h2 className="font-display text-base font-semibold">Add a source</h2>
            <form onSubmit={handleAddSource} className="mt-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="stitle">Title</Label>
                <Input id="stitle" required value={sourceTitle} onChange={(e) => setSourceTitle(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="surl">URL (optional)</Label>
                <Input id="surl" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="snote">Note (optional)</Label>
                <textarea
                  id="snote"
                  rows={2}
                  value={sourceNote}
                  onChange={(e) => setSourceNote(e.target.value)}
                  className="flex w-full rounded-sm border border-input bg-card px-3 py-2 text-sm focus-ring"
                />
              </div>
              <Button type="submit" variant="accent" disabled={adding} className="self-start">
                {adding ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Add source
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-base font-semibold">
            Collected sources ({sources.length})
          </h2>
          {sources.length === 0 && (
            <p className="text-sm text-muted-foreground">No sources collected yet.</p>
          )}
          {sources.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-start justify-between gap-3 pt-4">
                <div>
                  <p className="text-sm font-medium leading-snug">{s.title}</p>
                  {s.note && <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>}
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Added {formatDate(s.added_at)}
                  </p>
                </div>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <ExternalLink className="size-4 text-accent" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
