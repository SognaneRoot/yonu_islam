"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

export function DhikrAudio({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span className="flex items-center gap-1 text-[11px] text-sand-500" title={`Audio à ajouter : ${src}`}>
        <VolumeX size={13} /> Audio non disponible
      </span>
    );
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => setMissing(true));
    }
  }

  return (
    <>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs text-sand-400 transition-colors hover:text-gold-400"
      >
        {playing ? <Pause size={14} /> : <Volume2 size={14} />}
        {playing ? "Pause" : "Écouter"}
      </button>
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setMissing(true)}
        className="hidden"
      />
    </>
  );
}
