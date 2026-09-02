export type GrammarTerm = { arabic: string; transliteration: string; translation: string; example?: string };

export const ARABIC_GRAMMAR_TERMS: GrammarTerm[] = [
  { arabic: "اِسْم", transliteration: "Ism", translation: "Nom", example: "كِتَاب (un livre)" },
  { arabic: "فِعْل", transliteration: "Fi'l", translation: "Verbe", example: "كَتَبَ (il a écrit)" },
  { arabic: "حَرْف", transliteration: "Harf", translation: "Particule", example: "فِي (dans)" },
  { arabic: "فَاعِل", transliteration: "Fa'il", translation: "Sujet (du verbe)" },
  { arabic: "مَفْعُول بِهِ", transliteration: "Maf'ul bihi", translation: "Complément d'objet" },
  { arabic: "مُبْتَدَأ", transliteration: "Mubtada", translation: "Sujet nominal" },
  { arabic: "خَبَر", transliteration: "Khabar", translation: "Prédicat" },
  { arabic: "جُمْلَة", transliteration: "Jumla", translation: "Phrase" },
  { arabic: "مُذَكَّر", transliteration: "Mudhakkar", translation: "Masculin" },
  { arabic: "مُؤَنَّث", transliteration: "Mu'annath", translation: "Féminin" },
  { arabic: "مُفْرَد", transliteration: "Mufrad", translation: "Singulier" },
  { arabic: "جَمْع", transliteration: "Jam'", translation: "Pluriel" },
  { arabic: "مَاضِي", transliteration: "Madi", translation: "Passé (verbe)" },
  { arabic: "مُضَارِع", transliteration: "Mudari'", translation: "Présent/futur (verbe)" },
];