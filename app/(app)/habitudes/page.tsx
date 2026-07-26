import type { Metadata } from "next";
import { HabitudesClient } from "./habitudes-client";

export const metadata: Metadata = {
  title: "Suivi des habitudes — Fajr, Coran, dhikr et plus",
  description:
    "Coche tes habitudes quotidiennes, suis tes séries sans rechute et visualise ton assiduité sur un calendrier annuel.",
};

export default function Page() {
  return <HabitudesClient />;
}
