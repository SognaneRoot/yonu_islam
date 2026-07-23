"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StepImage } from "@/components/step-image";
import { Step } from "@/lib/data/steps";
import { useAppData } from "@/lib/store";
import { CheckCircle2, Circle } from "lucide-react";

export function StepsGrid({ steps, prefix }: { steps: Step[]; prefix: string }) {
  const { data, toggleFavorite } = useAppData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step) => {
        const key = `${prefix}-${step.id}-done`;
        const done = data.favorites.includes(key);
        return (
          <Card key={step.id} className={done ? "border-emerald-500/30" : undefined}>
            <CardContent className="space-y-3 p-4">
              <StepImage src={step.image} alt={step.title} />
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-300">
                  {step.number}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base leading-tight text-beige-50">{step.title}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-beige-100/90">{step.description}</p>
              <button
                onClick={() => toggleFavorite(key)}
                className="flex items-center gap-1.5 text-xs text-sand-400 transition-colors hover:text-emerald-300"
              >
                {done ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-400" /> Étape maîtrisée
                  </>
                ) : (
                  <>
                    <Circle size={14} /> Marquer comme maîtrisée
                  </>
                )}
              </button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
