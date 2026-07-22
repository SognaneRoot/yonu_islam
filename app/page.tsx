"use client";

import { CrescentProgress } from "@/components/crescent-progress";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEFAULT_HABITS } from "@/lib/data/habits";
import { LEVELS, levelForXp } from "@/lib/data/levels";
import { useAppData } from "@/lib/store";
import { todayISO } from "@/lib/utils";
import { BookOpen, Flame, Clock, Target, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data, ready, toggleHabit, logStudyMinutes } = useAppData();
  const { current, next, progress } = levelForXp(data.xp);
  const overallPercent = Math.round((data.xp / LEVELS[LEVELS.length - 1].xpRequired) * 100);

  const today = todayISO();
  const todayLog = data.habitLog[today] || {};
  const doneCount = DEFAULT_HABITS.filter((h) => todayLog[h.id]).length;

  const totalMinutes = Object.values(data.studyMinutesLog).reduce((a, b) => a + b, 0);
  const weekMinutes = Object.entries(data.studyMinutesLog)
    .filter(([d]) => {
      const diff = (new Date(today).getTime() - new Date(d).getTime()) / 86400000;
      return diff >= 0 && diff < 7;
    })
    .reduce((a, [, v]) => a + v, 0);

  const lastBook = [...data.library]
    .filter((b) => b.progress > 0 && b.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0];

  if (!ready) return null;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-night-600/70 via-night-700 to-emerald-800/30 p-6 sm:p-9">
        <div className="pointer-events-none absolute inset-0 bg-crescent-glow" />
        <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md text-center sm:text-left">
            <Badge variant="gold">As-salamu alaykum</Badge>
            <h1 className="mt-3 font-display text-2xl leading-snug text-beige-50 sm:text-3xl">
              Chaque jour est une nouvelle opportunité de revenir vers Allah.
            </h1>
            <p className="mt-3 text-sm text-sand-400">
              Niveau {current.id} — {current.title} · {progress}% vers {next ? next.title : "le dernier niveau"}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Link href="/habitudes">
                <Button variant="secondary">Voir mes tâches du jour</Button>
              </Link>
              <Link href="/niveaux">
                <Button variant="outline">Ma progression</Button>
              </Link>
            </div>
          </div>
          <CrescentProgress percent={overallPercent} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Série sans rechute" value={`${data.streakDays} j`} />
        <StatCard icon={Target} label="Niveau spirituel" value={`${current.id} / ${LEVELS.length}`} accent="gold" />
        <StatCard icon={CheckCircle2} label="Tâches aujourd'hui" value={`${doneCount}/${DEFAULT_HABITS.length}`} />
        <StatCard icon={Clock} label="Temps d'étude total" value={`${Math.round(totalMinutes / 60)} h`} accent="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tâches du jour</CardTitle>
              <CardDescription>Coche ce que tu as accompli aujourd'hui</CardDescription>
            </div>
            <Link href="/habitudes" className="text-xs text-gold-400 hover:underline">
              Tout voir
            </Link>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {DEFAULT_HABITS.map((h) => {
              const done = !!todayLog[h.id];
              return (
                <button
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-night-700/50 px-3.5 py-2.5 text-left text-sm transition-colors hover:border-emerald-500/40"
                >
                  {done ? (
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                  ) : (
                    <Circle size={18} className="shrink-0 text-sand-500" />
                  )}
                  <span className={done ? "text-sand-400 line-through" : "text-beige-100"}>{h.label}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Weekly goal */}
        <Card>
          <CardHeader>
            <CardTitle>Objectif hebdomadaire</CardTitle>
            <CardDescription>
              {weekMinutes} / {data.weeklyGoalMinutes} minutes d'étude
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={(weekMinutes / data.weeklyGoalMinutes) * 100} />
            <Button size="sm" variant="outline" className="w-full" onClick={() => logStudyMinutes(15)}>
              + Ajouter 15 min d'étude
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Next course */}
        <Card>
          <CardHeader>
            <CardTitle>Prochain cours à étudier</CardTitle>
            <CardDescription>D'après ton niveau actuel</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={current.href}
              className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-4 transition-colors hover:bg-emerald-500/14"
            >
              <div>
                <p className="font-display text-base text-beige-50">{current.title}</p>
                <p className="text-sm text-sand-400">{current.subtitle}</p>
              </div>
              <ArrowRight size={18} className="text-emerald-300" />
            </Link>
          </CardContent>
        </Card>

        {/* Last book */}
        <Card>
          <CardHeader>
            <CardTitle>Dernier livre consulté</CardTitle>
            <CardDescription>Reprends ta lecture là où tu t'es arrêté</CardDescription>
          </CardHeader>
          <CardContent>
            {lastBook ? (
              <Link
                href="/bibliotheque"
                className="flex items-center justify-between rounded-xl border border-white/8 bg-night-700/50 p-4 transition-colors hover:border-gold-500/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-base text-beige-50">{lastBook.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={lastBook.progress} className="w-28" />
                    <span className="text-xs text-sand-400">{lastBook.progress}%</span>
                  </div>
                </div>
                <BookOpen size={18} className="shrink-0 text-gold-400" />
              </Link>
            ) : (
              <p className="text-sm text-sand-400">Aucune lecture en cours pour le moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
