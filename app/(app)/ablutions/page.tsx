import { CategoryTemplate } from "@/components/category-template";
import { COURSE_CATEGORIES } from "@/lib/data/courses";
import { WUDU_STEPS } from "@/lib/data/steps";

export default function Page() {
  return <CategoryTemplate category={COURSE_CATEGORIES["ablutions"]} steps={WUDU_STEPS} />;
}
