"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ARABIC_ALPHABET } from "@/lib/data/arabic-letters";
import { useAppData } from "@/lib/store";
import { CheckCircle2, Circle, Volume2 } from "lucide-react";
import { useState } from "react";

export function ArabicAlphabetGrid() {
  const { data, toggleFavorite } = useAppData();
  const [speechSupported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  function speak(letter: string) {
    if (!speechSupported) return;
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = "ar-SA";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {ARABIC_ALPHABET.map((l) => {
        const key = `arabe-lettre-${l.name}`;
        const known = data.favorites.includes(key);
        return (
          <Card key={l.name} className={known ? "border-emerald-500/30" : undefined}>
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <p className="font-arabic text-5xl text-beige-50">{l.letter}</p>
              <div>
                <p className="font-display text-base text-beige-50">{l.name}</p>
                <p className="text-xs text-sand-400">{l.transliteration}</p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => speak(l.letter)}
                  disabled={!speechSupported}
                  className="flex items-center gap-1 text-xs text-gold-400 hover:underline disabled:opacity-40"
                  title={speechSupported ? "Écouter la prononciation" : "Synthèse vocale non supportée sur ce navigateur"}
                >
                  <Volume2 size={14} /> Écouter
                </button>
                <button onClick={() => toggleFavorite(key)} className="flex items-center gap-1 text-xs text-sand-400 hover:text-emerald-300">
                  {known ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} />}
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}