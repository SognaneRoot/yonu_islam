import type { Metadata } from "next";
import { AdhkarClient } from "./adhkar-client";

export const metadata: Metadata = {
  title: "Adhkar — Invocations du matin, du soir et du quotidien",
  description:
    "Mémorise les adhkar authentiques (matin, soir, sommeil, voyage, repas, mosquée...) avec l'arabe, la translittération et la traduction française.",
};

export default function Page() {
  return <AdhkarClient />;
}
