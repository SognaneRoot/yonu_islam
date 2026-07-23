import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "emerald",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: "emerald" | "gold";
}) {
  return (
    <Card className="flex items-center gap-3.5 p-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent === "emerald" ? "bg-emerald-500/15 text-emerald-300" : "bg-gold-500/15 text-gold-300"
        )}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-sand-400">{label}</p>
        <p className="font-display text-lg text-beige-50">{value}</p>
      </div>
    </Card>
  );
}
