export type LibraryItem = {
  id: string;
  title: string;
  category: string;
  pages: number;
  progress: number; // 0-100
  favorite: boolean;
  file?: string; // filename to place in /public/assets/books/
};

export const DEFAULT_LIBRARY: LibraryItem[] = [
  { id: "lib-1", title: "Les Trois Fondements", category: "Aqida", pages: 24, progress: 40, favorite: true, file: "trois-fondements.pdf" },
  { id: "lib-2", title: "Les Quatre Règles", category: "Aqida", pages: 16, progress: 0, favorite: false, file: "quatre-regles.pdf" },
  { id: "lib-3", title: "Kitab At-Tawhid", category: "Aqida", pages: 180, progress: 0, favorite: false, file: "kitab-at-tawhid.pdf" },
  { id: "lib-4", title: "Les 40 Hadiths d'An-Nawawi", category: "Hadith", pages: 96, progress: 15, favorite: false, file: "quarante-hadith-nawawi.pdf" },
  { id: "lib-5", title: "Riyad As-Salihin", category: "Hadith", pages: 620, progress: 5, favorite: false, file: "riyad-as-salihin.pdf" },
  { id: "lib-6", title: "Bulugh Al-Maram", category: "Hadith", pages: 340, progress: 0, favorite: false, file: "bulugh-al-maram.pdf" },
  { id: "lib-7", title: "Fiqh As-Sunnah — La prière", category: "Prière", pages: 88, progress: 60, favorite: true, file: "fiqh-sunnah-priere.pdf" },
  { id: "lib-9", title: "Fiqh As-Sunnah — La purification", category: "Ablutions", pages: 60, progress: 0, favorite: false, file: "fiqh-sunnah-purification.pdf" },
  { id: "lib-8", title: "Le Saint Coran (avec tafsir)", category: "Coran", pages: 604, progress: 0, favorite: true, file: "coran-tafsir.pdf" },
  { id: "lib-10", title: "La Purification de l'âme", category: "Purification du cœur", pages: 210, progress: 0, favorite: false, file: "purification-de-lame.pdf" },
  { id: "lib-11", title: "Livre de Médine — Niveau 1", category: "Arabe", pages: 160, progress: 0, favorite: false, file: "medina-arabe-livre1.pdf" },
];
