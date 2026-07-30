"use client";

import { useHighlights } from "@/lib/highlights";
import { useRef, useState } from "react";
import { Page } from "react-pdf";

export function HighlightablePage({
  bookId,
  pageNumber,
  width,
}: {
  bookId: string;
  pageNumber: number;
  width: number;
}) {
  const { highlights, addHighlight, removeHighlight } = useHighlights(bookId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pendingButton, setPendingButton] = useState<{ x: number; y: number; rects: DOMRect[] } | null>(
    null
  );

  const pageHighlights = highlights.filter((h) => h.page === pageNumber);

  function handleMouseUp() {
    const selection = window.getSelection();
    const container = containerRef.current;
    if (!selection || selection.isCollapsed || selection.rangeCount === 0 || !container) {
      setPendingButton(null);
      return;
    }
    const text = selection.toString().trim();
    if (!text) {
      setPendingButton(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const range = selection.getRangeAt(0);
    const clientRects = Array.from(range.getClientRects()).filter(
      (r) => r.width > 0 && r.top >= containerRect.top - 2 && r.bottom <= containerRect.bottom + 2
    );
    if (clientRects.length === 0) {
      setPendingButton(null);
      return;
    }

    const last = clientRects[clientRects.length - 1];
    setPendingButton({
      x: Math.min(last.right - containerRect.left, containerRect.width - 90),
      y: last.bottom - containerRect.top,
      rects: clientRects,
    });
  }

  function confirmHighlight() {
    const container = containerRef.current;
    if (!pendingButton || !container) return;
    const containerRect = container.getBoundingClientRect();
    const text = window.getSelection()?.toString().trim() || "";

    const rects = pendingButton.rects.map((r) => ({
      x: ((r.left - containerRect.left) / containerRect.width) * 100,
      y: ((r.top - containerRect.top) / containerRect.height) * 100,
      width: (r.width / containerRect.width) * 100,
      height: (r.height / containerRect.height) * 100,
    }));

    addHighlight({ page: pageNumber, rects, text });
    window.getSelection()?.removeAllRanges();
    setPendingButton(null);
  }

  return (
    <div ref={containerRef} className="relative inline-block" onMouseUp={handleMouseUp}>
      <Page
        pageNumber={pageNumber}
        width={width}
        renderAnnotationLayer={false}
        renderTextLayer
        className="shadow-2xl"
      />

      {/* Surlignages déjà enregistrés — clique dessus pour supprimer */}
      <div className="pointer-events-none absolute inset-0">
        {pageHighlights.map((h) =>
          h.rects.map((r, i) => (
            <button
              key={`${h.id}-${i}`}
              onClick={() => removeHighlight(h.id)}
              title="Cliquer pour supprimer le surlignage"
              className="pointer-events-auto absolute rounded-sm bg-gold-500/40 transition-colors hover:bg-red-500/50"
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
                width: `${r.width}%`,
                height: `${r.height}%`,
                mixBlendMode: "multiply",
              }}
            />
          ))
        )}
      </div>

      {/* Bouton flottant après une sélection de texte */}
      {pendingButton && (
        <button
          onClick={confirmHighlight}
          className="absolute z-10 rounded-lg bg-gold-500 px-2.5 py-1 text-xs font-medium text-night-800 shadow-soft hover:bg-gold-400"
          style={{ left: pendingButton.x, top: pendingButton.y + 6 }}
        >
          Surligner
        </button>
      )}
    </div>
  );
}
