"use client";

import { cn } from "@/lib/utils";

export function Heatmap({
  habitLog,
  totalHabits,
  weeks = 20,
}: {
  habitLog: Record<string, Record<string, boolean>>;
  totalHabits: number;
  weeks?: number;
}) {
  const days: { date: string; ratio: number }[] = [];
  const today = new Date();
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const log = habitLog[iso] || {};
    const done = Object.values(log).filter(Boolean).length;
    days.push({ date: iso, ratio: totalHabits ? done / totalHabits : 0 });
  }

  const columns: { date: string; ratio: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((day) => (
            <div
              key={day.date}
              title={`${day.date} — ${Math.round(day.ratio * 100)}%`}
              className={cn(
                "h-3 w-3 rounded-[3px]",
                day.ratio === 0 && "bg-white/6",
                day.ratio > 0 && day.ratio < 0.4 && "bg-emerald-800",
                day.ratio >= 0.4 && day.ratio < 0.75 && "bg-emerald-600",
                day.ratio >= 0.75 && "bg-gold-500"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
