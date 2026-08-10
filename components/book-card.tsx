"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen } from "lucide-react";

const GRADIENTS = ["from-emerald-700 to-emerald-900", "from-night-500 to-night-800", "from-gold-600 to-emerald-800", "from-emerald-800 to-night-800"];

function gradientFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export function BookCover({ id, title }: { id: string; title: string }) {
  const [errored, setErrored] = useState(false);
  const src = `/assets/covers/${id}.jpg`;

  if (errored) {
    return (
      <div className={`relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-lg bg-gradient-to-br ${gradientFor(id)} p-3 text-center`}>
        <BookOpen size={22} className="text-gold-300/70" />
        <p className="font-display text-xs leading-snug text-beige-50/90 line-clamp-4">{title}</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/8 bg-night-700/40">
      <Image src={src} alt={title} fill sizes="200px" quality={70} loading="lazy" onError={() => setErrored(true)} className="object-cover" />
    </div>
  );
}