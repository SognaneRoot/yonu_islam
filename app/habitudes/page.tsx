"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heatmap } from "@/components/heatmap";
import { DEFAULT_HABITS } from "@/lib/data/habits";
import { useAppData } from "@/lib/store";
import { todayISO } from "@/lib/utils";
import { CheckCircle2, Circle, Flame } from "lucide-react";
import * as Icons from "lucide-react";

function habitStreak(habitLog: Record<string, Record<string, boolean>>, habitId: string) {
  let streak = 0;
  const d = new Date();
  for (;;) {
    const iso = d.toISOString().slice(0, 10);
    if (habitLog[iso]?.[habitId]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function HabitudesPage() {
  const { data, toggleHabit } = useAppData();
  const today = todayISO();
  const todayLog = data.habitLog[today] || {};

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Suivi des habitudes</h1>
        <p className="mt-1 text-sm text-sand-400">La régularité vaut mieux que la quantité</p>
      </div>

      <div className="space-y-3">
        {DEFAULT_HABITS.map((h) => {
          const done = !!todayLog[h.id];
          const streak = habitStreak(data.habitLog, h.id);
          const Icon = (Icons as any)[
            h.icon
              .split("-")
              .map((s, i) => (i === 0 ? s[0].toUpperCase() + s.slice(1) : s[0].toUpperCase() + s.slice(1)))
              .join("")
          ] as Icons.LucideIcon | undefined;

          return (
            <Card key={h.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <button onClick={() => toggleHabit(h.id)} className="shrink-0">
                  {done ? (
                    <CheckCircle2 size={22} className="text-emerald-400" />
                  ) : (
                    <Circle size={22} className="text-sand-500" />
                  )}
                </button>
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  {Icon && <Icon size={16} className="shrink-0 text-gold-400" />}
                  <span className={done ? "text-sand-400 line-through" : "text-beige-100"}>{h.label}</span>
                </div>
                {streak > 0 && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-gold-400">
                    <Flame size={13} /> {streak}j
                  </span>
                )}
                <div className="hidden shrink-0 gap-1 sm:flex">
                  {last7.map((d) => (
                    <span
                      key={d}
                      className={`h-2 w-2 rounded-full ${
                        data.habitLog[d]?.[h.id] ? "bg-emerald-500" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendrier d'assiduité</CardTitle>
          <CardDescription>Les 20 dernières semaines — plus la case est dorée, plus la journée est complète</CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap habitLog={data.habitLog} totalHabits={DEFAULT_HABITS.length} />
        </CardContent>
      </Card>
    </div>
  );
}
