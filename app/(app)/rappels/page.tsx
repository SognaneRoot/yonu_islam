import type { Metadata } from "next";
import { RappelsClient } from "./rappels-client";

export const metadata: Metadata = {
  title: "Rappels — Fajr, prières, Adhkar, Coran | Mon Chemin vers Allah",
  description:
    "Active des notifications pour les 5 prières (calculées selon ta position), les adhkar du matin/soir et ta lecture du Coran.",
};

export default function Page() {
  return <RappelsClient />;
}
