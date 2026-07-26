import type { Metadata } from "next";
import { CategoryTemplate } from "@/components/category-template";
import { COURSE_CATEGORIES } from "@/lib/data/courses";
import { WUDU_STEPS } from "@/lib/data/steps";

const category = COURSE_CATEGORIES["ablutions"];

export const metadata: Metadata = {
  title: `${category.title} — Étapes du wudu | Mon Chemin vers Allah`,
  description:
    "Apprends les ablutions (wudu) étape par étape, avec obligations, sunnan, annulatifs et quiz.",
};

export default function Page() {
  return <CategoryTemplate category={category} steps={WUDU_STEPS} />;
}
