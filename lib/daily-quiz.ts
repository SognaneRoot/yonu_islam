import { COURSE_CATEGORIES } from "./data/courses";

// Prière et Ablutions sont toujours gratuits (PDF + quiz) — les bases du culte ne sont
// jamais verrouillées. Les autres modules avec quiz tournent : 3 gratuits par jour.
const ALWAYS_FREE_SLUGS = ["priere", "ablutions"];

const ROTATING_QUIZ_SLUGS = Object.values(COURSE_CATEGORIES)
  .filter((c) => c.quiz.length > 0 && !ALWAYS_FREE_SLUGS.includes(c.slug))
  .map((c) => c.slug);

function dateSeed(date: string) {
  let hash = 0;
  for (let i = 0; i < date.length; i++) hash = (hash * 31 + date.charCodeAt(i)) | 0;
  return hash;
}

// mulberry32 — petit générateur pseudo-aléatoire déterministe à partir d'une graine
function seededRandom(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Renvoie les slugs de catégories dont le quiz est gratuit aujourd'hui (en plus de
 * Prière/Ablutions qui sont toujours gratuits). Même résultat pour tout le monde le
 * même jour ; change automatiquement le lendemain. */
export function getFreeQuizSlugsToday(count = 3, date = new Date().toISOString().slice(0, 10)) {
  const rand = seededRandom(dateSeed(date));
  const shuffled = [...ROTATING_QUIZ_SLUGS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function isQuizFreeToday(slug: string) {
  if (ALWAYS_FREE_SLUGS.includes(slug)) return true;
  return getFreeQuizSlugsToday().includes(slug);
}

export function isBookCategoryAlwaysFree(category: string) {
  return category === "Prière" || category === "Ablutions";
}
