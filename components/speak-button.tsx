"use client";

import { useArabicVoice } from "@/lib/speech";
import { Volume2 } from "lucide-react";

export function SpeakButton({ text }: { text: string }) {
  const { speak, supported, hasArabicVoice } = useArabicVoice();

  if (!supported) {
    return <span className="text-[11px] text-sand-500">Synthèse vocale non supportée</span>;
  }

  return (
    <button
      onClick={() => speak(text)}
      className="flex items-center gap-1 text-xs text-gold-400 hover:underline"
      title={hasArabicVoice ? "Écouter" : "Aucune voix arabe trouvée sur cet appareil — le son peut être absent ou approximatif"}
    >
      <Volume2 size={14} /> Écouter
    </button>
  );
}