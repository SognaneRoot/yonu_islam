"use client";

import { useEffect, useState } from "react";

export function useArabicVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);

    function pickVoice() {
      const voices = window.speechSynthesis.getVoices();
      const arabic = voices.find((v) => v.lang.toLowerCase().startsWith("ar"));
      setVoice(arabic || null);
    }

    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
  }, []);

  function speak(text: string) {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "ar-SA";
    }
    utterance.rate = 0.75;
    window.speechSynthesis.speak(utterance);
  }

  return { speak, supported, hasArabicVoice: !!voice };
}