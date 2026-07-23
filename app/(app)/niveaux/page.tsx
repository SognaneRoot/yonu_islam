"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LEVELS, levelForXp } from "@/lib/data/levels";
import { useAppData } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Lock, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NiveauxPage() {
  const { data, ready } = useAppData();
  if (!ready) return null;
  const { current, idx } = levelForXp(data.xp);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Ta progression</h1>
        <p className="mt-1 text-sm text-sand-400">
          Niveau {current.id} — {current.title} · {data.xp} XP au total
        </p>
      </div>

      <div className="relative space-y-3">
        {LEVELS.map((level, i) => {
          const unlocked = data.xp >= level.xpRequired;
          const isCurrent = i === idx;
          const next = LEVELS[i + 1];
          const levelProgress = next
            ? Math.max(0, Math.min(100, Math.round(((data.xp - level.xpRequired) / (next.xpRequired - level.xpRequired)) * 100)))
            : 100;

          return (
            <Card
              key={level.id}
              className={cn(
                "transition-colors",
                isCurrent && "border-gold-500/40 bg-gold-500/5",
                !unlocked && "opacity-60"
              )}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-base",
                    unlocked ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-sand-500"
                  )}
                >
                  {unlocked ? (isCurrent ? <Sparkles size={18} /> : level.id) : <Lock size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={unlocked ? level.href : "#"} className="font-display text-base text-beige-50 hover:underline">
                      Niveau {level.id} — {level.title}
                    </Link>
                    {isCurrent && <Badge variant="gold">En cours</Badge>}
                    {!unlocked && <Badge variant="outline">{level.xpRequired} XP requis</Badge>}
                    {unlocked && !isCurrent && i < idx && <Badge variant="default">Terminé</Badge>}
                  </div>
                  <p className="text-sm text-sand-400">{level.subtitle}</p>
                  {unlocked && (
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={levelProgress} className="max-w-xs" />
                      <span className="text-xs text-sand-400">{levelProgress}%</span>
                    </div>
                  )}
                </div>
                {unlocked && i < idx && <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
