import { cn } from "@/lib/utils";
import React from "react";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "gold" | "outline" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-emerald-500/15 text-emerald-300",
        variant === "gold" && "bg-gold-500/15 text-gold-300",
        variant === "outline" && "border border-white/15 text-sand-400",
        className
      )}
      {...props}
    />
  );
}
