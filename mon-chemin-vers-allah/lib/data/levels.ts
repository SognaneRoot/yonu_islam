export type Level = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  xpRequired: number;
  href: string;
};

export const LEVELS: Level[] = [
  { id: 1, slug: "fondations", title: "Les fondations", subtitle: "Intention, sincérité et premiers pas", xpRequired: 0, href: "/purification" },
  { id: 2, slug: "tawhid", title: "Tawhid", subtitle: "L'unicité d'Allah", xpRequired: 200, href: "/aqida" },
  { id: 3, slug: "purification-coeur", title: "Purification du cœur", subtitle: "Sincérité, patience, gratitude", xpRequired: 500, href: "/purification" },
  { id: 4, slug: "coran", title: "Coran", subtitle: "Lecture, mémorisation, tafsir", xpRequired: 900, href: "/coran" },
  { id: 5, slug: "sira", title: "Sira", subtitle: "La vie du Prophète ﷺ", xpRequired: 1400, href: "/sira" },
  { id: 6, slug: "fiqh", title: "Fiqh", subtitle: "Jurisprudence de la vie quotidienne", xpRequired: 2000, href: "/fiqh" },
  { id: 7, slug: "hadith", title: "Hadith", subtitle: "Les paroles du Prophète ﷺ", xpRequired: 2700, href: "/hadith" },
  { id: 8, slug: "bonnes-oeuvres", title: "Bonnes œuvres", subtitle: "Adab, sadaqa, bon comportement", xpRequired: 3500, href: "/habitudes" },
  { id: 9, slug: "arabe", title: "Arabe", subtitle: "La langue du Coran", xpRequired: 4400, href: "/arabe" },
  { id: 10, slug: "transmission", title: "Transmission du savoir", subtitle: "Enseigner et transmettre", xpRequired: 5400, href: "/bibliotheque" },
];

export function levelForXp(xp: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) current = l;
  }
  const idx = LEVELS.findIndex((l) => l.id === current.id);
  const next = LEVELS[idx + 1];
  const progress = next
    ? Math.min(100, Math.round(((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100))
    : 100;
  return { current, next, progress, idx };
}
