"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useAppData } from "@/lib/store";
import Link from "next/link";

const PdfPageViewer = dynamic(
  () => import("@/components/pdf-page-viewer").then((m) => m.PdfPageViewer),
  { ssr: false }
);

export function LectureContent() {
  const params = useSearchParams();
  const bookId = params.get("book");
  const { data, update, ready } = useAppData();

  if (!ready) return null;

  const book = data.library.find((b) => b.id === bookId);

  if (!book || !book.file) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-night-800 px-6 text-center">
        <p className="text-beige-100">Livre introuvable.</p>
        <Link href="/bibliotheque" className="text-sm text-gold-400 hover:underline">
          Retour à la bibliothèque
        </Link>
      </div>
    );
  }

  const pageKey = `page:${book.id}`;
  const storedPage = data.notes[pageKey] ? parseInt(data.notes[pageKey], 10) : null;
  const page = storedPage || Math.max(1, Math.round((book.progress / 100) * (book.pages || 1)) || 1);

  function handlePageChange(p: number) {
    const clamped = Math.max(1, book!.pages ? Math.min(p, book!.pages) : p);
    const newProgress = book!.pages ? Math.min(100, Math.round((clamped / book!.pages) * 100)) : book!.progress;
    update((prev) => ({
      ...prev,
      notes: { ...prev.notes, [pageKey]: String(clamped) },
      library: prev.library.map((b) => (b.id === book!.id ? { ...b, progress: newProgress } : b)),
    }));
  }

  return (
    <PdfPageViewer
      file={`/assets/books/${book.file}`}
      title={book.title}
      page={page}
      totalPages={book.pages}
      onPageChange={handlePageChange}
      backHref="/bibliotheque"
    />
  );
}
