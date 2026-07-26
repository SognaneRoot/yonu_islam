import type { Metadata } from "next";
import { CombatClient } from "./combat-client";

export const metadata: Metadata = {
  title: "Mon Combat — Journal privé contre les péchés",
  description:
    "Un espace privé et bienveillant pour suivre tes rechutes et tes progrès dans la lutte contre les péchés, sans jamais te juger.",
};

export default function Page() {
  return <CombatClient />;
}
