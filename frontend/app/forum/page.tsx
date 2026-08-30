"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, MessageSquareText, Link2, ShieldQuestion, LoaderCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "@/lib/utils";
import { api } from "@/lib/api";
import { MOCK_FORUM_POSTS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import type { ForumPost, PostLabel } from "@/lib/types";

const LABEL_STYLE: Record<PostLabel, string> = {
  Opinion: "border-muted-foreground/30 text-muted-foreground",
  "Factual Claim": "border-verified/40 text-verified",
  "Legal Analysis": "border-primary/30 text-primary",
  Question: "border-pending/40 text-pending",
  "Research Finding": "border-accent/40 text-accent",
  "Policy Proposal": "border-disputed/40 text-disputed",
};

const LABEL_OPTIONS: PostLabel[] = [
  "Opinion",
  "Factual Claim",
  "Legal Analysis",
  "Question",
  "Research Finding",
  "Policy Proposal",
];

export default function ForumPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const [label, setLabel] = useState<PostLabel>("Question");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await api.forum.list();
      setPosts(data);
      setUsingMock(false);
    } catch {
      setPosts(MOCK_FORUM_POSTS);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setError("Please sign in first.");
      return;
    }

    setPosting(true);
    try {
      await api.forum.create({ label, title, body }, token);
      setTitle("");
      setBody("");
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post. Is the backend running?");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="container py-14">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Users className="size-3.5" /> Open Voice
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Public Forum</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Discuss situations, ask legal questions, challenge interpretations and share
            perspectives. Every post is labelled by type.
          </p>
        </div>
        {!signedIn && (
          <Button asChild variant="accent" className="shrink-0">
            <Link href="/login">Sign in to post</Link>
          </Button>
        )}
      </div>

      {usingMock && !loading && (
        <p className="mt-4 rounded-sm border border-pending/30 bg-pending/5 px-3 py-2 text-xs text-pending">
          Showing sample posts — the backend isn&rsquo;t reachable, so this is
          seed content, not the live forum.
        </p>
      )}

      {signedIn && (
        <Card className="mt-8">
          <CardContent className="pt-5">
            <h2 className="font-display text-base font-semibold">Post to Open Voice</h2>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="label">Label</Label>
                <select
                  id="label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value as PostLabel)}
                  className="flex h-10 w-full rounded-sm border border-input bg-card px-3 py-2 text-sm focus-ring"
                >
                  {LABEL_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="body">Body</Label>
                <textarea
                  id="body"
                  required
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="flex w-full rounded-sm border border-input bg-card px-3 py-2 text-sm focus-ring"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="accent" disabled={posting} className="self-start">
                {posting && <LoaderCircle className="size-4 animate-spin" />}
                Post
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mt-10 flex flex-col gap-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="outline" className={`font-mono text-[10px] ${LABEL_STYLE[post.label]}`}>
                  {post.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDateTime(post.created_at)}</span>
              </div>

              <p className="mt-3 font-display text-base font-semibold leading-snug">{post.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{post.author_name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{post.body}</p>

              <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Link2 className="size-3.5" /> {post.sources_attached} sources attached
                </span>
                <span className="flex items-center gap-1">
                  <ShieldQuestion className="size-3.5" /> {post.challenges} challenges
                </span>
                <span className="ml-auto flex items-center gap-1 text-accent">
                  <MessageSquareText className="size-3.5" /> Reply
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
