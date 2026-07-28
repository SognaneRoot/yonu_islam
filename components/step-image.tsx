"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
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

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/8 bg-night-700/40">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={70}
        loading="lazy"
        onError={() => setErrored(true)}
        className="object-cover"
      />
    </div>
  );
}
