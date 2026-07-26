import type { Metadata } from "next";
import { BibliothequeClient } from "./bibliotheque-client";

export const metadata: Metadata = {
  title: "Bibliothèque — Livres et PDF islamiques",
  description:
    "Accède à des livres classiques (Les Trois Fondements, 40 Hadiths d'An-Nawawi, Riyad As-Salihin, Kitab At-Tawhid...) directement dans l'application.",
};

export default function Page() {
  return <BibliothequeClient />;
}
