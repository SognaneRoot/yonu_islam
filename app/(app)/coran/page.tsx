import type { Metadata } from "next";
import { CoranClient } from "./coran-client";

export const metadata: Metadata = {
  title: "Lecture du Coran — Suivi quotidien et tafsir",
  description:
    "Fixe un objectif de lecture quotidien du Coran, suis ta progression page par page et accède au tafsir directement dans l'application.",
};

export default function Page() {
  return <CoranClient />;
}
