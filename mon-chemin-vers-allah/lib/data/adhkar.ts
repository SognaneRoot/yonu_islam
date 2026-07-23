export type Dhikr = {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repetitions: number;
};

export type AdhkarCategory = {
  id: string;
  label: string;
  icon: string;
  items: Dhikr[];
};

export const ADHKAR_CATEGORIES: AdhkarCategory[] = [
  {
    id: "matin",
    label: "Matin",
    icon: "sunrise",
    items: [
      {
        id: "matin-1",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
        transliteration: "Asbahna wa asbaha-l-mulku lillah, wal-hamdu lillah",
        translation:
          "Nous voici au matin, et avec nous la royauté d'Allah ; louange à Allah.",
        repetitions: 1,
      },
      {
        id: "matin-2",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ",
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya wa bika namutu",
        translation:
          "Ô Allah, c'est par Toi que nous entrons dans le matin, par Toi le soir, par Toi nous vivons et par Toi nous mourons.",
        repetitions: 1,
      },
      {
        id: "matin-3",
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'udhu bikalimatillahi-t-tammati min sharri ma khalaq",
        translation:
          "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
        repetitions: 3,
      },
    ],
  },
  {
    id: "soir",
    label: "Soir",
    icon: "sunset",
    items: [
      {
        id: "soir-1",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
        transliteration: "Amsayna wa amsa-l-mulku lillah, wal-hamdu lillah",
        translation:
          "Nous voici au soir, et avec nous la royauté d'Allah ; louange à Allah.",
        repetitions: 1,
      },
      {
        id: "soir-2",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ",
        transliteration: "Allahumma inni as'aluka khayra hadhihi-l-layla",
        translation: "Ô Allah, je Te demande le bien de cette nuit.",
        repetitions: 1,
      },
    ],
  },
  {
    id: "sommeil",
    label: "Sommeil",
    icon: "moon",
    items: [
      {
        id: "sommeil-1",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya",
        translation: "En Ton nom, ô Allah, je meurs et je vis.",
        repetitions: 1,
      },
    ],
  },
  {
    id: "reveil",
    label: "Réveil",
    icon: "alarm-clock",
    items: [
      {
        id: "reveil-1",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Al-hamdu lillahi-lladhi ahyana ba'da ma amatana wa ilayhi-n-nushur",
        translation:
          "Louange à Allah qui nous a rendu la vie après nous avoir fait mourir, et c'est vers Lui la résurrection.",
        repetitions: 1,
      },
    ],
  },
  {
    id: "mosquee",
    label: "Mosquée",
    icon: "landmark",
    items: [
      {
        id: "mosquee-1",
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allahumma-ftah li abwaba rahmatik",
        translation: "Ô Allah, ouvre-moi les portes de Ta miséricorde.",
        repetitions: 1,
      },
    ],
  },
  {
    id: "maison",
    label: "Maison",
    icon: "home",
    items: [
      {
        id: "maison-1",
        arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا",
        transliteration: "Bismillahi walajna wa bismillahi kharajna",
        translation: "Au nom d'Allah nous entrons, au nom d'Allah nous sortons.",
        repetitions: 1,
      },
    ],
  },
  {
    id: "voyage",
    label: "Voyage",
    icon: "car",
    items: [
      {
        id: "voyage-1",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
        transliteration: "Subhana-lladhi sakhkhara lana hadha wa ma kunna lahu muqrinin",
        translation:
          "Gloire à Celui qui a mis ceci à notre service, alors que nous n'aurions pu y parvenir seuls.",
        repetitions: 1,
      },
    ],
  },
  {
    id: "repas",
    label: "Repas",
    icon: "utensils",
    items: [
      {
        id: "repas-1",
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah",
        translation: "Au nom d'Allah.",
        repetitions: 1,
      },
      {
        id: "repas-2",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration: "Al-hamdu lillahi-lladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwa",
        translation:
          "Louange à Allah qui m'a nourri de ceci et me l'a accordé sans force ni pouvoir de ma part.",
        repetitions: 1,
      },
    ],
  },
  {
    id: "toilettes",
    label: "Toilettes",
    icon: "droplets",
    items: [
      {
        id: "toilettes-1",
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        transliteration: "Allahumma inni a'udhu bika mina-l-khubthi wal-khaba'ith",
        translation: "Ô Allah, je cherche refuge auprès de Toi contre les démons mâles et femelles.",
        repetitions: 1,
      },
    ],
  },
];
