import { GraduationCap, Clock, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { MOCK_COURSES } from "@/lib/mock-data";
import type { Course } from "@/lib/types";

const LEVEL_STYLE: Record<string, string> = {
  Beginner: "border-verified/40 text-verified",
  Intermediate: "border-pending/40 text-pending",
  Advanced: "border-disputed/40 text-disputed",
};

async function getCourses(): Promise<Course[]> {
  try {
    return await api.courses.list();
  } catch {
    return MOCK_COURSES;
  }
}

export default async function LearnPage() {
  const courses = await getCourses();

  return (
    <div className="container py-14">
      <div className="max-w-2xl">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <GraduationCap className="size-3.5" /> Learn
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Short courses for entering IHL/IHRL research
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Practical, hands-on explainers — from reading a treaty to running a
          source matrix — built for people who are new to legal research, not
          just lawyers.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Card key={c.id} className="flex flex-col justify-between">
            <CardContent className="pt-5">
              <Badge variant="outline" className={`font-mono text-[10px] ${LEVEL_STYLE[c.level]}`}>
                {c.level}
              </Badge>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>

              <div className="mt-3 flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <Clock className="size-3.5" /> {c.duration_minutes} min
              </div>

              <div className="mt-4 border-t border-border pt-3">
                <h4 className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  <ListChecks className="size-3.5" /> Modules
                </h4>
                <ul className="mt-2 space-y-1 text-sm">
                  {c.modules.map((m) => (
                    <li key={m} className="text-muted-foreground">
                      · {m}
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="accent" size="sm" className="mt-5 w-full">
                Start course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
