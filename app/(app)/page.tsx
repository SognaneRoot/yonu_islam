import type { Metadata } from "next";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: "Mon Chemin vers Allah — Tableau de bord spirituel quotidien",
  description:
    "Suis ta progression spirituelle jour après jour : prière, Coran, adhkar, habitudes, niveaux et bien plus, dans un compagnon islamique tout-en-un.",
};

export default function Page() {
  return <HomeClient />;
}
