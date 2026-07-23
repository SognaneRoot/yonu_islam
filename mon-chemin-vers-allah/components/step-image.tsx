"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";

export function StepImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-night-700/50 text-sand-500">
        <ImageOff size={22} />
        <span className="px-2 text-center text-[11px] leading-tight">
          Image à ajouter dans<br />
          <code className="text-gold-400">{src}</code>
        </span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="aspect-square w-full rounded-xl border border-white/8 object-cover"
    />
  );
}
