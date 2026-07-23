"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/book-card";
import { CourseCategory } from "@/lib/data/courses";
import { Step } from "@/lib/data/steps";
import { StepsGrid } from "@/components/steps-grid";
import { useAppData } from "@/lib/store";
import { cn, normalizeKey } from "@/lib/utils";
import { CheckCircle2, Circle, Heart, Star } from "lucide-react";
import { useState } from "react";

export function CategoryTemplate({ category, steps }: { category: CourseCategory; steps?: Step[] }) {
  const { data, toggleFavorite, setNote, setQuizScore } = useAppData();
  const [openSection, setOpenSection] = useState<string | null>(category.sections[0]?.id ?? null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const noteKey = `${category.slug}-notes`;
  const isFavorite = data.favorites.includes(category.slug);
  const bestScore = data.quizScores[category.slug] || 0;
  const sectionsRead = category.sections.filter((s) => data.favorites.includes(`${category.slug}-${s.id}-read`));
  const courseProgress = Math.round((sectionsRead.length / category.sections.length) * 100);
  const relatedBooks = category.libraryCategory
  ? data.library.filter((b) => normalizeKey(b.category) === normalizeKey(category.libraryCategory!))
  : [];

  function submitQuiz() {
    const correct = category.quiz.filter((q) => quizAnswers[q.id] === q.answerIndex).length;
    const score = Math.round((correct / category.quiz.length) * 100);
    setQuizScore(category.slug, score);
    setQuizSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl text-beige-50">{category.title}</h1>
            <button onClick={() => toggleFavorite(category.slug)} aria-label="Ajouter aux favoris">
              <Heart
                size={18}
                className={isFavorite ? "fill-gold-500 text-gold-500" : "text-sand-500"}
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-sand-400">{category.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={courseProgress} className="w-28" />
          <span className="text-xs text-sand-400">{courseProgress}%</span>
        </div>
      </div>

      <Tabs defaultValue={steps ? "etapes" : "cours"}>
        <TabsList>
          {steps && <TabsTrigger value="etapes">Étapes</TabsTrigger>}
          <TabsTrigger value="cours">Cours</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="notes">Mes notes</TabsTrigger>
        </TabsList>

        {steps && (
          <TabsContent value="etapes" className="mt-5">
            <StepsGrid steps={steps} prefix={category.slug} />
          </TabsContent>
        )}

        <TabsContent value="cours" className="mt-5 space-y-3">
          {category.sections.map((section) => {
            const open = openSection === section.id;
            const readKey = `${category.slug}-${section.id}-read`;
            const isRead = data.favorites.includes(readKey);
            return (
              <Card key={section.id}>
                <button
                  className="flex w-full items-center justify-between p-4 text-left"
                  onClick={() => setOpenSection(open ? null : section.id)}
                >
                  <div className="flex items-center gap-2.5">
                    {isRead ? (
                      <CheckCircle2 size={17} className="text-emerald-400" />
                    ) : (
                      <Circle size={17} className="text-sand-500" />
                    )}
                    <span className="font-display text-base text-beige-50">{section.title}</span>
                  </div>
                  <span className="text-xs text-sand-400">{open ? "réduire" : "lire"}</span>
                </button>
                {open && (
                  <CardContent className="space-y-3 pt-0">
                    {section.content.map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed text-beige-100/90">
                        {p}
                      </p>
                    ))}
                    <Button
                      size="sm"
                      variant={isRead ? "outline" : "primary"}
                      onClick={() => toggleFavorite(readKey)}
                    >
                      {isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="pdf" className="mt-5 space-y-3">
          {relatedBooks.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-sm text-sand-400">
                Aucun PDF associé à ce module pour l'instant. Dépose-en un dans{" "}
                <code className="text-gold-400">public/assets/books/</code> et ajoute-le dans{" "}
                <code className="text-gold-400">lib/data/library.ts</code> avec{" "}
                <code className="text-gold-400">category: &quot;{category.libraryCategory || category.title}&quot;</code>.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quiz" className="mt-5 space-y-4">
          {bestScore > 0 && (
            <Badge variant="gold">Meilleur score : {bestScore}%</Badge>
          )}
          {category.quiz.map((q) => (
            <Card key={q.id}>
              <CardContent className="space-y-3 p-4">
                <p className="font-display text-base text-beige-50">{q.question}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, i) => {
                    const selected = quizAnswers[q.id] === i;
                    const showResult = quizSubmitted;
                    const isCorrect = i === q.answerIndex;
                    return (
                      <button
                        key={i}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: i }))}
                        className={cn(
                          "rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors",
                          selected && !showResult && "border-gold-500/50 bg-gold-500/10",
                          !selected && !showResult && "border-white/8 hover:border-white/20",
                          showResult && isCorrect && "border-emerald-500/60 bg-emerald-500/10",
                          showResult && selected && !isCorrect && "border-red-500/50 bg-red-500/10"
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
          {!quizSubmitted ? (
            <Button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < category.quiz.length}>
              Valider le quiz
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Star size={16} className="text-gold-400" />
              <span className="text-sm text-beige-100">Quiz terminé — score enregistré.</span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-5">
          <Card>
            <CardContent className="p-4">
              <textarea
                className="min-h-[180px] w-full resize-y rounded-xl border border-white/8 bg-night-700/50 p-3.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
                placeholder="Écris tes notes personnelles sur ce module..."
                defaultValue={data.notes[noteKey] || ""}
                onBlur={(e) => setNote(noteKey, e.target.value)}
              />
              <p className="mt-2 text-xs text-sand-400">Enregistré automatiquement</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
