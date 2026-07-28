import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-badge)] px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-foreground border border-border",
        purple: "bg-accent-purple/15 text-[#c4b5fd] border border-accent-purple/30",
        blue: "bg-accent-blue/15 text-[#93c5fd] border border-accent-blue/30",
        success: "bg-success/15 text-[#86efac] border border-success/30",
        warning: "bg-warning/15 text-[#fcd34d] border border-warning/30",
        error: "bg-error/15 text-[#fca5a5] border border-error/30",
        outline: "border border-border text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
