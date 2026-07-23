"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ADHKAR_CATEGORIES } from "@/lib/data/adhkar";
import { useAppData } from "@/lib/store";
import { CheckCircle2, Circle, Repeat } from "lucide-react";

export default function AdhkarPage() {
  const { data, toggleAdhkar } = useAppData();
  const totalItems = ADHKAR_CATEGORIES.flatMap((c) => c.items).length;
  const memorized = Object.values(data.adhkarDone).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-beige-50">Adhkar</h1>
          <p className="mt-1 text-sm text-sand-400">Invocations du quotidien, à réviser et mémoriser</p>
        </div>
        <Badge variant="gold">{memorized}/{totalItems} mémorisées</Badge>
      </div>

      <Tabs defaultValue={ADHKAR_CATEGORIES[0].id}>
        <TabsList>
          {ADHKAR_CATEGORIES.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ADHKAR_CATEGORIES.map((c) => (
          <TabsContent key={c.id} value={c.id} className="mt-5 space-y-3">
            {c.items.map((dhikr) => {
              const done = !!data.adhkarDone[dhikr.id];
              return (
                <Card key={dhikr.id} className={done ? "border-emerald-500/30" : undefined}>
                  <CardContent className="space-y-3 p-5">
                    <p dir="rtl" className="font-arabic text-right text-2xl leading-loose text-beige-50">
                      {dhikr.arabic}
                    </p>
                    <p className="text-sm italic text-gold-300">{dhikr.transliteration}</p>
                    <p className="text-sm text-beige-100/90">{dhikr.translation}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5 text-xs text-sand-400">
                        <Repeat size={13} /> {dhikr.repetitions}×
                      </span>
                      <button
                        onClick={() => toggleAdhkar(dhikr.id)}
                        className="flex items-center gap-1.5 text-xs text-sand-400 transition-colors hover:text-emerald-300"
                      >
                        {done ? (
                          <>
                            <CheckCircle2 size={16} className="text-emerald-400" /> Mémorisée
                          </>
                        ) : (
                          <>
                            <Circle size={16} /> Marquer comme mémorisée
                          </>
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
