"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { todayISO } from "@/lib/utils";
import { BookOpen, Star, Upload } from "lucide-react";
import { useState } from "react";

const TOTAL_PAGES = 604;

export default function CoranPage() {
  const { data, update, addXp, logStudyMinutes } = useAppData();
  const [pagesToday, setPagesToday] = useState(1);
  const pagesRead = data.notes["coran-pages-read"] ? parseInt(data.notes["coran-pages-read"]) : 0;
  const dailyGoal = 4;
  const todayLog = data.studyMinutesLog[todayISO()] || 0;

  function addPages(n: number) {
    update((prev) => ({
      ...prev,
      notes: { ...prev.notes, ["coran-pages-read"]: String(pagesRead + n) },
    }));
    addXp(n * 3);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Coran</h1>
        <p className="mt-1 text-sm text-sand-400">Lecture quotidienne, mémorisation et suivi de progression</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Objectif quotidien</CardTitle>
            <CardDescription>{pagesToday} page(s) — ajuste selon ton rythme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="range"
              min={1}
              max={20}
              value={pagesToday}
              onChange={(e) => setPagesToday(Number(e.target.value))}
              className="w-full accent-gold-500"
            />
            <Button onClick={() => addPages(pagesToday)}>
              <BookOpen size={16} /> J'ai lu {pagesToday} page(s) aujourd'hui
            </Button>
            <div className="pt-2">
              <div className="mb-1.5 flex justify-between text-xs text-sand-400">
                <span>Progression du Mus'haf</span>
                <span>{pagesRead} / {TOTAL_PAGES} pages</span>
              </div>
              <Progress value={(pagesRead / TOTAL_PAGES) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-sand-400">Pages lues au total</span>
              <span className="text-beige-100">{pagesRead}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-400">Étude aujourd'hui</span>
              <span className="text-beige-100">{todayLog} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-400">Complété</span>
              <span className="text-beige-100">{Math.round((pagesRead / TOTAL_PAGES) * 100)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reprendre la lecture / Tafsir</CardTitle>
          <CardDescription>Importe ton Mus'haf ou un tafsir en PDF pour lire directement dans l'app</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 p-8 text-center transition-colors hover:border-gold-500/40">
            <Upload size={22} className="text-gold-400" />
            <span className="text-sm text-beige-100">Importer un PDF (Mus'haf, tafsir...)</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={() => logStudyMinutes(0)} />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star size={16} className="text-gold-400" /> Favoris & mémorisation
          </CardTitle>
          <CardDescription>Marque les sourates que tu mémorises depuis la bibliothèque</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
