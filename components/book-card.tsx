"use client";

import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { PdfReader } from "./pdf-reader";
import { PremiumGate } from "./premium-gate";
import { useAppData } from "@/lib/store";
import { isBookCategoryAlwaysFree } from "@/lib/daily-quiz";
import { Heart } from "lucide-react";
import { LibraryItem } from "@/lib/data/library";

export function BookCard({ book }: { book: LibraryItem }) {
  const { data, toggleFavorite } = useAppData();
  const favorite = book.favorite || data.favorites.includes(book.id);
  const pageKey = `page:${book.id}`;
  const storedPage = data.notes[pageKey] ? parseInt(data.notes[pageKey], 10) : null;
  const page = storedPage || Math.max(1, Math.round((book.progress / 100) * (book.pages || 1)) || 1);
  const alwaysFree = isBookCategoryAlwaysFree(book.category);

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display text-base text-beige-50">{book.title}</p>
            <p className="text-xs text-sand-400">
              {book.category}
              {book.pages ? ` · ${book.pages} pages` : ""}
            </p>
          </div>
          <button onClick={() => toggleFavorite(book.id)} aria-label="favori">
            <Heart size={16} className={favorite ? "fill-gold-500 text-gold-500" : "text-sand-500"} />
          </button>
        </div>
        <Progress value={book.progress} />
        <div className="flex items-center justify-between text-xs text-sand-400">
          <span>{book.progress}% lu</span>
        </div>
        {alwaysFree ? (
          <PdfReader bookId={book.id} page={page} />
        ) : (
          <PremiumGate compact>
            <PdfReader bookId={book.id} page={page} />
          </PremiumGate>
        )}
      </CardContent>
    </Card>
  );
}
