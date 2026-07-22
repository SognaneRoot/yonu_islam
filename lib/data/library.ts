export type LibraryItem = {
  id: string;
  title: string;
  category: string;
  pages: number;
  progress: number; // 0-100
  favorite: boolean;
};

export const DEFAULT_LIBRARY: LibraryItem[] = [
  { id: "lib-1", title: "Les Trois Fondements", category: "Aqida", pages: 24, progress: 40, favorite: true },
  { id: "lib-2", title: "Les 40 Hadiths d'An-Nawawi", category: "Hadith", pages: 96, progress: 15, favorite: false },
  { id: "lib-3", title: "Riyad As-Salihin", category: "Hadith", pages: 620, progress: 5, favorite: false },
  { id: "lib-4", title: "Kitab At-Tawhid", category: "Aqida", pages: 180, progress: 0, favorite: false },
  { id: "lib-5", title: "Fiqh As-Sunnah — La prière", category: "Fiqh", pages: 88, progress: 60, favorite: true },
];
