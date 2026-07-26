import type { Metadata } from "next";
import { SiraClient } from "./sira-client";

export const metadata: Metadata = {
  title: "Sira — La vie du Prophète Muhammad ﷺ",
  description:
    "Frise chronologique des grands événements de la sira : naissance, révélation, hijra, Badr, Uhud, conquête de La Mecque et sermon d'adieu.",
};

export default function Page() {
  return <SiraClient />;
}
