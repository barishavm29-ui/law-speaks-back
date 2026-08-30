import { Check, X, CircleDashed, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SourceMatrixRow, SourceType } from "@/lib/types";

const COLUMNS: { key: SourceType; label: string }[] = [
  { key: "official_statement", label: "Official" },
  { key: "local_journalism", label: "Local press" },
  { key: "international_journalism", label: "Int'l press" },
  { key: "ngo_documentation", label: "NGO" },
  { key: "eyewitness", label: "Eyewitness" },
  { key: "open_source", label: "Open source" },
  { key: "legal_finding", label: "Legal finding" },
];

const POSITION_ICON = {
  supports: { icon: Check, className: "text-verified" },
  contradicts: { icon: X, className: "text-disputed" },
  unclear: { icon: CircleDashed, className: "text-pending" },
  silent: { icon: Minus, className: "text-muted-foreground/40" },
};

export function SourceMatrix({ rows }: { rows: SourceMatrixRow[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="p-3 text-left font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Claim
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="p-3 text-center font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className={cn(idx % 2 === 1 && "bg-secondary/20")}>
              <td className="border-t border-border p-3 text-sm leading-snug">{row.claim}</td>
              {COLUMNS.map((col) => {
                const position = row.positions[col.key] ?? "silent";
                const { icon: Icon, className } = POSITION_ICON[position];
                return (
                  <td key={col.key} className="border-t border-border p-3 text-center">
                    <Icon className={cn("mx-auto size-4", className)} strokeWidth={2} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
