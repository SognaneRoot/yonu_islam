"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SIRA_TIMELINE } from "@/lib/data/sira";
import { useAppData } from "@/lib/store";
import { CheckCircle2, Circle } from "lucide-react";

export default function SiraPage() {
  const { data, toggleFavorite } = useAppData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Sira</h1>
        <p className="mt-1 text-sm text-sand-400">La vie du Prophète Muhammad ﷺ, étape par étape</p>
      </div>

      <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
        {SIRA_TIMELINE.map((event) => {
          const key = `sira-${event.id}-read`;
          const read = data.favorites.includes(key);
          return (
            <div key={event.id} className="relative">
              <span
                className={`absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                  read ? "border-gold-500 bg-gold-500" : "border-white/30 bg-night-700"
                }`}
              />
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{event.year}</Badge>
                    <h3 className="font-display text-base text-beige-50">{event.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-beige-100/90">{event.description}</p>
                  <button
                    onClick={() => toggleFavorite(key)}
                    className="mt-3 flex items-center gap-1.5 text-xs text-sand-400 hover:text-emerald-300"
                  >
                    {read ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-400" /> Étudié
                      </>
                    ) : (
                      <>
                        <Circle size={14} /> Marquer comme étudié
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
