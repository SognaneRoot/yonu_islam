import { cn } from "@/lib/utils";
import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-night-700",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" &&
          "bg-emerald-500 text-white hover:bg-emerald-400 shadow-soft",
        variant === "secondary" &&
          "bg-gold-500 text-night-800 hover:bg-gold-400 shadow-soft",
        variant === "outline" &&
          "border border-white/15 text-beige-100 hover:bg-white/5",
        variant === "ghost" && "text-beige-100 hover:bg-white/5",
        variant === "danger" && "bg-red-500/90 text-white hover:bg-red-500",
        className
      )}
      {...props}
    />
  );
}
