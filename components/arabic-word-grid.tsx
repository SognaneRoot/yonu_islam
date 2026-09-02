"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SpeakButton } from "@/components/speak-button";

type Word = { arabic: string; transliteration: string; translation: string; example?: string };

export function ArabicWordGrid({ words }: { words: Word[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {words.map((w) => (
        <Card key={w.arabic}>
          <CardContent className="space-y-1.5 p-4">
            <p className="font-arabic text-2xl text-beige-50">{w.arabic}</p>
            <p className="text-sm italic text-gold-300">{w.transliteration}</p>
            <p className="text-sm text-beige-100/90">{w.translation}</p>
            {w.example && <p className="text-xs text-sand-400">{w.example}</p>}
            <SpeakButton text={w.arabic} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}