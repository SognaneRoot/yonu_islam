"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { daysBetween, todayISO } from "@/lib/utils";
import { HeartHandshake, RotateCcw, ShieldHalf } from "lucide-react";
import { useState } from "react";

export default function CombatPage() {
  const { data, logRelapse, addReflexion } = useAppData();
  const [showRelapseForm, setShowRelapseForm] = useState(false);
  const [trigger, setTrigger] = useState("");
  const [note, setNote] = useState("");
  const [reflexion, setReflexion] = useState("");

  const cleanDays = data.combat.cleanSince ? daysBetween(data.combat.cleanSince, todayISO()) : 0;

  function submitRelapse() {
    logRelapse(trigger, note);
    setTrigger("");
    setNote("");
    setShowRelapseForm(false);
  }

  function submitReflexion() {
    if (!reflexion.trim()) return;
    addReflexion(reflexion.trim());
    setReflexion("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Mon Combat</h1>
        <p className="mt-1 text-sm text-sand-400">Un espace privé pour avancer, sans jamais te juger</p>
      </div>

      <Card className="overflow-hidden border-emerald-500/25 bg-gradient-to-br from-emerald-800/25 to-night-700">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <ShieldHalf size={28} className="text-gold-400" />
          <p className="font-display text-4xl text-beige-50">{cleanDays}</p>
          <p className="text-sm text-sand-400">jour{cleanDays > 1 ? "s" : ""} consécutif{cleanDays > 1 ? "s" : ""}</p>
          <p className="mx-auto mt-2 max-w-sm text-sm italic text-gold-300">
            « La miséricorde d'Allah est plus grande que tes péchés. »
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw size={16} className="text-gold-400" /> J'ai rechuté
            </CardTitle>
            <CardDescription>
              Ce n'est pas un échec définitif — c'est une occasion de repartir avec plus de sincérité.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showRelapseForm ? (
              <Button variant="outline" onClick={() => setShowRelapseForm(true)}>
                Enregistrer et repartir
              </Button>
            ) : (
              <div className="space-y-3">
                <input
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="Qu'est-ce qui a déclenché la rechute ? (optionnel)"
                  className="w-full rounded-xl border border-white/8 bg-night-700/50 px-3.5 py-2.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
                />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Comment te sens-tu ? Qu'as-tu appris ?"
                  className="min-h-[100px] w-full resize-y rounded-xl border border-white/8 bg-night-700/50 px-3.5 py-2.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button onClick={submitRelapse}>Confirmer</Button>
                  <Button variant="ghost" onClick={() => setShowRelapseForm(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartHandshake size={16} className="text-gold-400" /> Réflexion du jour
            </CardTitle>
            <CardDescription>Note une pensée, une gratitude, ou ce qui t'a aidé aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              value={reflexion}
              onChange={(e) => setReflexion(e.target.value)}
              placeholder="Écris librement..."
              className="min-h-[100px] w-full resize-y rounded-xl border border-white/8 bg-night-700/50 px-3.5 py-2.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
            />
            <Button variant="secondary" onClick={submitReflexion}>
              Ajouter au journal
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>{data.combat.journal.length} entrée(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.combat.journal.length === 0 && (
            <p className="text-sm text-sand-400">Ton journal est vide pour l'instant. Chaque pas compte.</p>
          )}
          {data.combat.journal.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-white/8 bg-night-700/40 p-3.5 text-sm"
            >
              <div className="flex items-center justify-between text-xs text-sand-400">
                <span>{entry.date}</span>
                <span className={entry.type === "relapse" ? "text-gold-400" : "text-emerald-300"}>
                  {entry.type === "relapse" ? "Rechute" : "Réflexion"}
                </span>
              </div>
              {entry.trigger && <p className="mt-1 text-sand-400">Déclencheur : {entry.trigger}</p>}
              <p className="mt-1 text-beige-100/90">{entry.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
