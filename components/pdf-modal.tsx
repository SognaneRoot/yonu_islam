"use client";

import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfModal({
  file,
  title,
  page,
  totalPages,
  onPageChange,
  onClose,
}: {
  file: string;
  title: string;
  page: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onClose: () => void;
}) {
  const [numPages, setNumPages] = useState<number | null>(totalPages || null);
  const [width, setWidth] = useState(360);

  useEffect(() => {
    function update() {
      setWidth(Math.min(window.innerWidth - 32, 760));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, numPages]);

  function goPrev() {
    onPageChange(Math.max(1, page - 1));
  }
  function goNext() {
    onPageChange(Math.min(numPages || page + 1, page + 1));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-night-800 px-4 py-3">
        <p className="min-w-0 truncate font-display text-sm text-beige-50">{title}</p>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs tabular-nums text-sand-300">
            {page} / {numPages ?? totalPages ?? "?"}
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-beige-100 hover:bg-white/10"
            aria-label="Fermer le lecteur"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-start justify-center overflow-auto p-4"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Document
          file={file}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          loading={
            <div className="flex h-64 items-center justify-center text-beige-100">
              <Loader2 size={22} className="animate-spin" />
            </div>
          }
          error={
            <p className="max-w-sm p-6 text-center text-sm text-red-300">
              Impossible de charger ce PDF. Vérifie qu'il est bien présent à l'emplacement attendu.
            </p>
          }
        >
          <Page
            pageNumber={page}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="shadow-2xl"
          />
        </Document>
      </div>

      <button
        onClick={goPrev}
        disabled={page <= 1}
        aria-label="Page précédente"
        className="fixed left-3 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-night-700/90 text-beige-100 shadow-soft transition-opacity hover:bg-night-600 disabled:opacity-0 sm:left-5"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={goNext}
        disabled={!!numPages && page >= numPages}
        aria-label="Page suivante"
        className="fixed right-3 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-night-700/90 text-beige-100 shadow-soft transition-opacity hover:bg-night-600 disabled:opacity-0 sm:right-5"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
