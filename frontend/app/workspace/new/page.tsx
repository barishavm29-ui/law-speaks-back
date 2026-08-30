"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, LoaderCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

export default function NewWorkspaceProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");
  const [methodology, setMethodology] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setError("Please sign in first.");
      return;
    }

    setLoading(true);
    try {
      const project = await api.workspace.createProject(
        { title, research_question: researchQuestion, methodology: methodology || undefined },
        token
      );
      router.push(`/workspace/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create project. Is the backend running?");
      setLoading(false);
    }
  }

  return (
    <div className="container flex justify-center py-14">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <FolderKanban className="size-5 text-accent" strokeWidth={1.75} />
            <h1 className="font-display text-xl font-semibold">New research project</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Project title</Label>
              <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rq">Research question</Label>
              <textarea
                id="rq"
                required
                rows={3}
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                className="flex w-full rounded-sm border border-input bg-card px-3 py-2 text-sm focus-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="methodology">Methodology (optional)</Label>
              <textarea
                id="methodology"
                rows={2}
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                className="flex w-full rounded-sm border border-input bg-card px-3 py-2 text-sm focus-ring"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" variant="accent" disabled={loading} className="mt-2">
              {loading && <LoaderCircle className="size-4 animate-spin" />}
              Create project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
