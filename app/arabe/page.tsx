import { CategoryTemplate } from "@/components/category-template";
import { COURSE_CATEGORIES } from "@/lib/data/courses";

export default function Page() {
  return <CategoryTemplate category={COURSE_CATEGORIES["arabe"]} />;
}
