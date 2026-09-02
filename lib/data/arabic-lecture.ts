export type Syllable = { arabic: string; transliteration: string };

export const ARABIC_SYLLABLES: { letter: string; name: string; syllables: Syllable[] }[] = [
  { letter: "ب", name: "Ba", syllables: [{ arabic: "بَ", transliteration: "ba" }, { arabic: "بِ", transliteration: "bi" }, { arabic: "بُ", transliteration: "bu" }] },
  { letter: "ت", name: "Ta", syllables: [{ arabic: "تَ", transliteration: "ta" }, { arabic: "تِ", transliteration: "ti" }, { arabic: "تُ", transliteration: "tu" }] },
  { letter: "ج", name: "Jim", syllables: [{ arabic: "جَ", transliteration: "ja" }, { arabic: "جِ", transliteration: "ji" }, { arabic: "جُ", transliteration: "ju" }] },
  { letter: "د", name: "Dal", syllables: [{ arabic: "دَ", transliteration: "da" }, { arabic: "دِ", transliteration: "di" }, { arabic: "دُ", transliteration: "du" }] },
  { letter: "ر", name: "Ra", syllables: [{ arabic: "رَ", transliteration: "ra" }, { arabic: "رِ", transliteration: "ri" }, { arabic: "رُ", transliteration: "ru" }] },
  { letter: "س", name: "Sin", syllables: [{ arabic: "سَ", transliteration: "sa" }, { arabic: "سِ", transliteration: "si" }, { arabic: "سُ", transliteration: "su" }] },
  { letter: "ل", name: "Lam", syllables: [{ arabic: "لَ", transliteration: "la" }, { arabic: "لِ", transliteration: "li" }, { arabic: "لُ", transliteration: "lu" }] },
  { letter: "م", name: "Mim", syllables: [{ arabic: "مَ", transliteration: "ma" }, { arabic: "مِ", transliteration: "mi" }, { arabic: "مُ", transliteration: "mu" }] },
  { letter: "ن", name: "Nun", syllables: [{ arabic: "نَ", transliteration: "na" }, { arabic: "نِ", transliteration: "ni" }, { arabic: "نُ", transliteration: "nu" }] },
  { letter: "ي", name: "Ya", syllables: [{ arabic: "يَ", transliteration: "ya" }, { arabic: "يِ", transliteration: "yi" }, { arabic: "يُ", transliteration: "yu" }] },
];