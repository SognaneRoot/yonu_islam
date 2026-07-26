import type { Metadata } from "next";
import { CategoryTemplate } from "@/components/category-template";
import { COURSE_CATEGORIES } from "@/lib/data/courses";
import { PRAYER_STEPS } from "@/lib/data/steps";

const category = COURSE_CATEGORIES["priere"];

export const metadata: Metadata = {
  title: `${category.title} — Étapes, cours et quiz | Mon Chemin vers Allah`,
  description:
    "Apprends à prier étape par étape (niyyah, takbir, ruku, sujud, tashahhud...) avec conditions, piliers, sunnan et quiz.",
};

export default function Page() {
  return <CategoryTemplate category={category} steps={PRAYER_STEPS} />;
}
