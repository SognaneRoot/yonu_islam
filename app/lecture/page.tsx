import { Suspense } from "react";
import { LectureContent } from "./lecture-content";

export default function LecturePage() {
  return (
    <Suspense fallback={null}>
      <LectureContent />
    </Suspense>
  );
}
