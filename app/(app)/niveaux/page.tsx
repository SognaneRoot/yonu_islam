import type { Metadata } from "next";
import { NiveauxClient } from "./niveaux-client";

export const metadata: Metadata = {
  title: "Ma progression spirituelle — Niveaux et XP",
  description:
    "Suis ta progression à travers 10 niveaux d'apprentissage islamique, des fondations à la transmission du savoir.",
};

export default function Page() {
  return <NiveauxClient />;
}
