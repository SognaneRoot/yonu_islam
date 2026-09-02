"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ARABIC_SYLLABLES } from "@/lib/data/arabic-lecture";
import { SpeakButton } from "@/components/speak-button";

export function ArabicSyllablesGrid() {
  return (
    <div className="space-y-3">
      {ARABIC_SYLLABLES.map((group) => (
        <Card key={group.name}>
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <span className="font-display text-lg text-gold-400">{group.name}</span>
            {group.syllables.map((s) => (
              <div key={s.arabic} className="flex items-center gap-1.5 rounded-lg border border-white/8 px-3 py-2">
                <span className="font-arabic text-2xl text-beige-50">{s.arabic}</span>
                <span className="text-xs text-sand-400">{s.transliteration}</span>
                <SpeakButton text={s.arabic} />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}