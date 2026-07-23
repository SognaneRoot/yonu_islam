import { CategoryTemplate } from "@/components/category-template";
import { COURSE_CATEGORIES } from "@/lib/data/courses";
import { PRAYER_STEPS } from "@/lib/data/steps";

export default function Page() {
  return <CategoryTemplate category={COURSE_CATEGORIES["priere"]} steps={PRAYER_STEPS} />;
}
