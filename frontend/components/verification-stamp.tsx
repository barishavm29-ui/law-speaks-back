import { ShieldCheck, CircleAlert, TriangleAlert, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/lib/types";

const STAMP_CONFIG: Record<
  VerificationStatus,
  { label: string; icon: typeof ShieldCheck; className: string }
> = {
  verified: {
    label: "Verified",
    icon: ShieldCheck,
    className: "border-verified/40 text-verified bg-verified/[0.06]",
  },
  reported: {
    label: "Reported",
    icon: CircleAlert,
    className: "border-pending/40 text-pending bg-pending/[0.06]",
  },
  disputed: {
    label: "Disputed",
    icon: TriangleAlert,
    className: "border-disputed/40 text-disputed bg-disputed/[0.06]",
  },
  unconfirmed: {
    label: "Unconfirmed",
    icon: CircleHelp,
    className: "border-muted-foreground/30 text-muted-foreground bg-transparent",
  },
};

export function VerificationStamp({
  status,
  size = "default",
  className,
}: {
  status: VerificationStatus;
  size?: "default" | "sm";
  className?: string;
}) {
  const config = STAMP_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "stamp -rotate-1 select-none border-[1.5px]",
        size === "sm" && "px-1.5 py-px text-[10px]",
        config.className,
        className
      )}
      title={`Verification status: ${config.label}`}
    >
      <Icon className={size === "sm" ? "size-3" : "size-3.5"} strokeWidth={2.25} />
      {config.label}
    </span>
  );
}
