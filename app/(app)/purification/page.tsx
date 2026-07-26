import type { Metadata } from "next";
import { CategoryTemplate } from "@/components/category-template";
import { COURSE_CATEGORIES } from "@/lib/data/courses";

const category = COURSE_CATEGORIES["purification"];

export const metadata: Metadata = {
  title: `${category.title} — Mon Chemin vers Allah`,
  description: category.tagline,
};

export default function Page() {
  return <CategoryTemplate category={category} />;
}
