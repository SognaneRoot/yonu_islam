export type ArabicLetter = {
  letter: string;
  name: string;
  transliteration: string;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
};

export const ARABIC_ALPHABET: ArabicLetter[] = [
  { letter: "ا", name: "Alif", transliteration: "A / ā", isolated: "ا", initial: "ا", medial: "ـا", final: "ـا" },
  { letter: "ب", name: "Ba", transliteration: "B", isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" },
  { letter: "ت", name: "Ta", transliteration: "T", isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" },
  { letter: "ث", name: "Tha", transliteration: "Th", isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" },
  { letter: "ج", name: "Jim", transliteration: "J", isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" },
  { letter: "ح", name: "Ha", transliteration: "H (emphatique)", isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" },
  { letter: "خ", name: "Kha", transliteration: "Kh", isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" },
  { letter: "د", name: "Dal", transliteration: "D", isolated: "د", initial: "د", medial: "ـد", final: "ـد" },
  { letter: "ذ", name: "Dhal", transliteration: "Dh", isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ" },
  { letter: "ر", name: "Ra", transliteration: "R", isolated: "ر", initial: "ر", medial: "ـر", final: "ـر" },
  { letter: "ز", name: "Zay", transliteration: "Z", isolated: "ز", initial: "ز", medial: "ـز", final: "ـز" },
  { letter: "س", name: "Sin", transliteration: "S", isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" },
  { letter: "ش", name: "Shin", transliteration: "Sh", isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" },
  { letter: "ص", name: "Sad", transliteration: "S (emphatique)", isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" },
  { letter: "ض", name: "Dad", transliteration: "D (emphatique)", isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" },
  { letter: "ط", name: "Ta emphatique", transliteration: "T (emphatique)", isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" },
  { letter: "ظ", name: "Za", transliteration: "Z (emphatique)", isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" },
  { letter: "ع", name: "Ayn", transliteration: "'", isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" },
  { letter: "غ", name: "Ghayn", transliteration: "Gh", isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" },
  { letter: "ف", name: "Fa", transliteration: "F", isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" },
  { letter: "ق", name: "Qaf", transliteration: "Q", isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" },
  { letter: "ك", name: "Kaf", transliteration: "K", isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" },
  { letter: "ل", name: "Lam", transliteration: "L", isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" },
  { letter: "م", name: "Mim", transliteration: "M", isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" },
  { letter: "ن", name: "Nun", transliteration: "N", isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" },
  { letter: "ه", name: "Ha", transliteration: "H", isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" },
  { letter: "و", name: "Waw", transliteration: "W / ū", isolated: "و", initial: "و", medial: "ـو", final: "ـو" },
  { letter: "ي", name: "Ya", transliteration: "Y / ī", isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" },
];