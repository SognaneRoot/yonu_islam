export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
};

export type CourseSection = {
  id: string;
  title: string;
  content: string[]; // paragraphs
};

export type CourseCategory = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  color: "emerald" | "gold" | "night";
  sections: CourseSection[];
  quiz: QuizQuestion[];
  libraryCategory?: string; // matches LibraryItem.category, links this module to its books
};

export const COURSE_CATEGORIES: Record<string, CourseCategory> = {
  priere: {
    slug: "priere",
    title: "Apprendre la prière",
    tagline: "Conditions, piliers, obligations et sunnan de la salat",
    icon: "hand-heart",
    color: "emerald",
    libraryCategory: "Prière",
    sections: [
      {
        id: "conditions",
        title: "Conditions de validité",
        content: [
          "La prière n'est valide que si certaines conditions sont réunies avant même de commencer : être musulman, doué de raison, avoir atteint l'âge de discernement, être en état de pureté rituelle (avoir fait les ablutions), la propreté du corps, des vêtements et du lieu de prière, la dissimulation des parties intimes (awra) et le fait de se tourner vers la qibla.",
          "Ajoute à cela l'entrée du temps de la prière : chaque prière obligatoire a une plage horaire précise, et prier avant l'heure la rend invalide.",
        ],
      },
      {
        id: "piliers",
        title: "Les piliers (arkan)",
        content: [
          "Les piliers sont les éléments sans lesquels la prière est nulle, même en cas d'oubli : la station debout pour qui le peut, le takbir d'ouverture, la récitation de la Fatiha à chaque unité, l'inclinaison (ruku'), le redressement, les deux prosternations, la position assise entre les deux prosternations, la sérénité (tuma'nina) dans chaque position, le tashahhud final et la position assise qui l'accompagne, le salut final, et le respect de l'ordre entre ces piliers.",
        ],
      },
      {
        id: "obligations",
        title: "Les obligations (wajibat)",
        content: [
          "Les obligations diffèrent des piliers : leur omission volontaire invalide la prière, mais un oubli se répare par la prosternation de l'oubli (sujud sahw). Parmi elles : les takbirs de transition, le tasbih dans l'inclinaison et la prosternation, dire 'sami'a Llahu liman hamidah', le premier tashahhud et sa position assise.",
        ],
      },
      {
        id: "sunnan",
        title: "Les sunnan",
        content: [
          "Les actes surérogatoires enrichissent la prière sans être obligatoires : la sourate après la Fatiha, lever les mains à certains moments, poser la main droite sur la gauche, regarder l'endroit de prosternation, et les invocations additionnelles.",
        ],
      },
      {
        id: "erreurs",
        title: "Erreurs fréquentes",
        content: [
          "Précipiter les mouvements sans sérénité, ne pas corriger les rangs en prière collective, réciter trop vite pour 'finir', oublier la sourate après la Fatiha alors qu'elle est recommandée, ou encore négliger la concentration (khushu').",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Que se passe-t-il si l'on oublie une obligation (wajib) de la prière ?",
        options: [
          "La prière est immédiatement nulle",
          "On effectue la prosternation de l'oubli (sujud sahw)",
          "Il faut recommencer depuis le début",
          "Cela n'a aucune conséquence",
        ],
        answerIndex: 1,
      },
      {
        id: "q2",
        question: "La récitation de la Fatiha dans chaque unité est :",
        options: ["Une sunna", "Un wajib", "Un pilier (rukn)", "Facultative"],
        answerIndex: 2,
      },
      {
        id: "q3",
        question: "Se tourner vers la qibla fait partie :",
        options: [
          "Des sunnan de la prière",
          "Des conditions de validité de la prière",
          "Des obligations réparables par sujud sahw",
          "D'aucune catégorie précise",
        ],
        answerIndex: 1,
      },
      {
        id: "q4",
        question: "La sérénité (tuma'nina) dans chaque position de la prière est :",
        options: ["Un pilier (rukn)", "Une sunna", "Facultative", "Réservée à la prière du vendredi"],
        answerIndex: 0,
      },
      {
        id: "q5",
        question: "Réciter une sourate après la Fatiha est considéré comme :",
        options: ["Un pilier", "Une obligation (wajib)", "Une sunna", "Interdit"],
        answerIndex: 2,
      },
      {
        id: "q6",
        question: "Parmi les erreurs fréquentes citées, laquelle nuit à la concentration (khushu') ?",
        options: [
          "Corriger les rangs avant la prière collective",
          "Réciter trop vite pour 'finir'",
          "Lever les mains au takbir",
          "Poser la main droite sur la gauche",
        ],
        answerIndex: 1,
      },
    ],
  },
  ablutions: {
    slug: "ablutions",
    title: "Les ablutions (wudu)",
    tagline: "Obligations, sunnan et annulatifs",
    icon: "droplets",
    color: "night",
    libraryCategory: "Ablutions",
    sections: [
      {
        id: "obligations",
        title: "Obligations du wudu",
        content: [
          "Se laver le visage, se laver les avant-bras jusqu'aux coudes, essuyer une partie de la tête, se laver les pieds jusqu'aux chevilles, respecter l'ordre entre ces membres, et les enchaîner sans interruption longue (muwalat).",
        ],
      },
      {
        id: "sunnan",
        title: "Sunnan du wudu",
        content: [
          "Commencer par 'Bismillah', se laver les mains trois fois avant de commencer, se rincer la bouche et le nez, passer trois fois sur chaque membre, essuyer l'ensemble de la tête et les oreilles, et terminer par l'attestation de foi.",
        ],
      },
      {
        id: "annulatifs",
        title: "Ce qui annule le wudu",
        content: [
          "Ce qui sort des deux voies naturelles, le sommeil profond, la perte de conscience, le contact direct de peau à peau entre époux selon certaines écoles, et le fait de manger de la viande de chameau selon l'avis le plus prudent.",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Le respect de l'ordre entre les membres du wudu est :",
        options: ["Une sunna", "Une obligation", "Sans importance", "Interdit"],
        answerIndex: 1,
      },
      {
        id: "q2",
        question: "Commencer le wudu par 'Bismillah' est :",
        options: ["Une obligation", "Une sunna", "Un annulatif", "Interdit"],
        answerIndex: 1,
      },
      {
        id: "q3",
        question: "Combien de fois lave-t-on classiquement chaque membre selon les sunnan du wudu ?",
        options: ["Une fois", "Deux fois", "Trois fois", "Quatre fois"],
        answerIndex: 2,
      },
      {
        id: "q4",
        question: "Le sommeil profond fait partie :",
        options: [
          "Des obligations du wudu",
          "Des sunnan du wudu",
          "De ce qui annule le wudu",
          "Des conditions de la prière uniquement",
        ],
        answerIndex: 2,
      },
      {
        id: "q5",
        question: "Essuyer une partie de la tête (masah) pendant le wudu est :",
        options: ["Une obligation", "Une sunna facultative", "Un annulatif", "Réservé aux hommes"],
        answerIndex: 0,
      },
    ],
  },
  aqida: {
    slug: "aqida",
    title: "Aqida — Le parcours de la croyance",
    tagline: "Les Trois Fondements · Les Quatre Règles · Kitab At-Tawhid",
    icon: "book-marked",
    color: "gold",
    libraryCategory: "Aqida",
    sections: [
      {
        id: "trois-fondements",
        title: "Les Trois Fondements",
        content: [
          "Ce texte fondateur enseigne à tout musulman de connaître son Seigneur, sa religion et son Prophète ﷺ, à travers les preuves tirées du Coran et de la Sunna, avant d'aborder les catégories du tawhid et les manifestations du shirk.",
        ],
      },
      {
        id: "quatre-regles",
        title: "Les Quatre Règles",
        content: [
          "Cet ouvrage clarifie la différence entre les polythéistes d'hier et les monothéistes, en exposant quatre règles permettant de comprendre pourquoi certains actes relèvent du shirk même chez des gens qui se réclamaient d'une croyance.",
        ],
      },
      {
        id: "kitab-tawhid",
        title: "Kitab At-Tawhid",
        content: [
          "Une compilation de versets et de hadiths organisés par chapitres, consacrée à l'unicité d'Allah dans Sa seigneurie, Son adoration et Ses noms et attributs, ainsi qu'aux dangers qui menacent le tawhid.",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Le tawhid se divise traditionnellement en combien de catégories principales ?",
        options: ["Deux", "Trois", "Cinq", "Sept"],
        answerIndex: 1,
      },
      {
        id: "q2",
        question: "'Les Trois Fondements' invite le musulman à connaître, en premier lieu :",
        options: [
          "Son Seigneur, sa religion et son Prophète ﷺ",
          "Les cinq piliers uniquement",
          "L'histoire des quatre écoles juridiques",
          "La grammaire arabe",
        ],
        answerIndex: 0,
      },
      {
        id: "q3",
        question: "'Les Quatre Règles' cherche surtout à expliquer :",
        options: [
          "Les règles de succession",
          "Pourquoi certains actes relèvent du shirk malgré une croyance affichée",
          "Le calendrier hégirien",
          "Les règles du jeûne",
        ],
        answerIndex: 1,
      },
      {
        id: "q4",
        question: "Kitab At-Tawhid est organisé principalement autour :",
        options: [
          "De récits de voyage",
          "De versets et hadiths classés par chapitres sur l'unicité d'Allah",
          "De la biographie des compagnons",
          "De la jurisprudence commerciale",
        ],
        answerIndex: 1,
      },
    ],
  },
  purification: {
    slug: "purification",
    title: "Purification du cœur",
    tagline: "Sincérité, patience, gratitude, confiance en Allah",
    icon: "sparkles",
    color: "emerald",
    libraryCategory: "Purification du cœur",
    sections: [
      { id: "sincerite", title: "Sincérité (ikhlas)", content: ["Agir uniquement pour Allah, sans rechercher le regard ou l'éloge des gens, est la condition d'acceptation de toute œuvre."] },
      { id: "patience", title: "Patience (sabr)", content: ["La patience se manifeste dans l'obéissance, face à l'épreuve, et pour se détourner de la désobéissance. Elle est décrite comme une lumière qui guide le croyant."] },
      { id: "gratitude", title: "Gratitude (shukr)", content: ["Reconnaître les bienfaits par le cœur, les exprimer par la langue et les traduire en actes est la marque du serviteur reconnaissant."] },
      { id: "tawakkul", title: "Confiance en Allah (tawakkul)", content: ["S'en remettre à Allah après avoir pris les moyens nécessaires, avec la certitude que Sa décision est la meilleure."] },
      { id: "khawf-rajaa", title: "Crainte et espérance", content: ["Le croyant avance entre la crainte de la sanction et l'espérance de la miséricorde, comme deux ailes d'un même oiseau."] },
      { id: "amour", title: "Amour d'Allah", content: ["L'amour le plus élevé est celui voué à Allah, qui se traduit par l'attachement à ce qu'Il aime et l'éloignement de ce qu'Il déteste."] },
    ],
    quiz: [
      {
        id: "q1",
        question: "L'ikhlas (sincérité) signifie avant tout :",
        options: [
          "Faire beaucoup d'actes de bien",
          "Agir uniquement pour Allah",
          "Être vu en train de bien agir",
          "Suivre les autres",
        ],
        answerIndex: 1,
      },
      {
        id: "q2",
        question: "La patience (sabr) se manifeste :",
        options: [
          "Uniquement face à l'épreuve",
          "Dans l'obéissance, face à l'épreuve, et pour se détourner de la désobéissance",
          "Seulement en cas de deuil",
          "Seulement pendant le jeûne",
        ],
        answerIndex: 1,
      },
      {
        id: "q3",
        question: "La gratitude (shukr) complète se traduit par :",
        options: [
          "Le cœur seul",
          "La langue seule",
          "Le cœur, la langue et les actes",
          "Les actes seuls",
        ],
        answerIndex: 2,
      },
      {
        id: "q4",
        question: "Le tawakkul (confiance en Allah) suppose :",
        options: [
          "De ne prendre aucun moyen et d'attendre",
          "De prendre les moyens nécessaires puis de s'en remettre à Allah",
          "De douter du décret d'Allah",
          "De ne compter que sur soi-même",
        ],
        answerIndex: 1,
      },
      {
        id: "q5",
        question: "Crainte et espérance sont décrites, dans la tradition, comme :",
        options: [
          "Deux sentiments à éviter",
          "Deux ailes d'un même oiseau",
          "Réservées aux savants",
          "Contradictoires entre elles",
        ],
        answerIndex: 1,
      },
    ],
  },
  hadith: {
    slug: "hadith",
    title: "Hadith",
    tagline: "Les 40 Hadiths d'An-Nawawi · Riyad As-Salihin · Bulugh Al-Maram",
    icon: "scroll-text",
    color: "night",
    libraryCategory: "Hadith",
    sections: [
      { id: "nawawi", title: "Les 40 Hadiths d'An-Nawawi", content: ["Une sélection concise de hadiths englobant les fondements de la religion, souvent recommandée comme premier recueil à mémoriser."] },
      { id: "riyad", title: "Riyad As-Salihin", content: ["Un vaste recueil organisé par thèmes de vertus et de bonnes mœurs, tiré des paroles et actes du Prophète ﷺ."] },
      { id: "bulugh", title: "Bulugh Al-Maram", content: ["Un recueil orienté vers les hadiths juridiques (fiqh), très utilisé dans l'étude comparée des écoles."] },
    ],
    quiz: [
      {
        id: "q1",
        question: "Bulugh Al-Maram est principalement centré sur :",
        options: ["Les vertus générales", "Les hadiths à portée juridique (fiqh)", "La sira", "La grammaire arabe"],
        answerIndex: 1,
      },
      {
        id: "q2",
        question: "Les 40 Hadiths d'An-Nawawi sont souvent recommandés parce qu'ils :",
        options: [
          "Couvrent en peu de hadiths les fondements de la religion",
          "Ne traitent que du jeûne",
          "Sont un recueil de poésie",
          "Remplacent le Coran",
        ],
        answerIndex: 0,
      },
      {
        id: "q3",
        question: "Riyad As-Salihin est organisé :",
        options: [
          "Par ordre chronologique des événements",
          "Par thèmes de vertus et de bonnes mœurs",
          "Par écoles juridiques",
          "Par régions géographiques",
        ],
        answerIndex: 1,
      },
    ],
  },
  fiqh: {
    slug: "fiqh",
    title: "Fiqh",
    tagline: "Purification, prière, jeûne, zakat, mariage, commerce, voyage, funérailles",
    icon: "scale",
    color: "gold",
    libraryCategory: "Fiqh",
    sections: [
      { id: "purification", title: "Purification", content: ["Les règles de la pureté rituelle conditionnent la validité de nombreux actes d'adoration."] },
      { id: "priere", title: "Prière", content: ["Structure, conditions et cas particuliers (voyage, maladie, prière du vendredi)."] },
      { id: "jeune", title: "Jeûne", content: ["Conditions de validité, annulatifs, cas de dispense et rattrapage."] },
      { id: "zakat", title: "Zakat", content: ["Calcul, seuil de richesse (nisab), catégories de biens concernés et bénéficiaires."] },
      { id: "mariage", title: "Mariage", content: ["Piliers du contrat, droits et devoirs réciproques entre époux."] },
      { id: "commerce", title: "Commerce", content: ["Principes de licéité, interdiction de l'intérêt (riba) et de l'incertitude excessive (gharar)."] },
      { id: "voyage", title: "Voyage", content: ["Facilités accordées au voyageur : raccourcissement et regroupement des prières, rupture du jeûne."] },
      { id: "funerailles", title: "Funérailles", content: ["Étapes du lavage, du linceul, de la prière mortuaire et de l'enterrement."] },
    ],
    quiz: [
      {
        id: "q1",
        question: "Le riba (intérêt) est en islam :",
        options: ["Recommandé", "Toléré en cas de besoin", "Interdit", "Obligatoire pour les commerçants"],
        answerIndex: 2,
      },
      {
        id: "q2",
        question: "Le nisab en matière de zakat désigne :",
        options: [
          "Le nombre de prières quotidiennes",
          "Le seuil de richesse à partir duquel la zakat est due",
          "La durée du jeûne",
          "Le nombre de témoins pour un mariage",
        ],
        answerIndex: 1,
      },
      {
        id: "q3",
        question: "Le voyageur bénéficie, entre autres facilités, de :",
        options: [
          "L'annulation totale de la prière",
          "Le raccourcissement et le regroupement des prières",
          "L'interdiction de rompre le jeûne",
          "Aucune facilité particulière",
        ],
        answerIndex: 1,
      },
      {
        id: "q4",
        question: "Le gharar, interdit en matière de commerce, désigne :",
        options: [
          "Un excès d'incertitude dans la transaction",
          "Un excès de générosité",
          "Le prix trop bas d'un produit",
          "Le paiement en plusieurs fois",
        ],
        answerIndex: 0,
      },
      {
        id: "q5",
        question: "Les étapes rituelles avant l'enterrement incluent, dans l'ordre habituel :",
        options: [
          "Linceul, puis lavage, puis prière mortuaire",
          "Lavage, linceul, puis prière mortuaire",
          "Prière mortuaire, puis lavage",
          "Aucune étape n'est requise",
        ],
        answerIndex: 1,
      },
    ],
  },
  arabe: {
    slug: "arabe",
    title: "Arabe coranique",
    tagline: "Alphabet, lecture, écriture, vocabulaire, grammaire",
    icon: "languages",
    color: "emerald",
    libraryCategory: "Arabe",
    sections: [
      { id: "alphabet", title: "Alphabet", content: ["custom:arabic-alphabet"] },
      { id: "lecture", title: "Lecture", content: ["custom:arabic-syllables"] },
      { id: "vocabulaire", title: "Vocabulaire coranique", content: ["custom:arabic-vocabulary"] },
      { id: "grammaire", title: "Grammaire", content: ["custom:arabic-grammar"] },
    ],
    quiz: [
      {
        id: "q1",
        question: "L'alphabet arabe comporte combien de lettres ?",
        options: ["24", "26", "28", "30"],
        answerIndex: 2,
      },
      {
        id: "q2",
        question: "Une lettre arabe peut changer de forme selon sa position dans le mot :",
        options: [
          "Faux, elle garde toujours la même forme",
          "Vrai — isolée, initiale, médiane ou finale",
          "Vrai, mais seulement pour trois lettres",
          "Cela dépend uniquement de la voyelle",
        ],
        answerIndex: 1,
      },
      {
        id: "q3",
        question: "Les harakat désignent :",
        options: [
          "Les voyelles courtes",
          "Les racines des mots",
          "Les règles de succession",
          "Les signes de ponctuation modernes",
        ],
        answerIndex: 0,
      },
      {
        id: "q4",
        question: "L'i'rab, en grammaire arabe, correspond :",
        options: [
          "Au vocabulaire religieux",
          "À la déclinaison grammaticale",
          "À l'alphabet",
          "À la calligraphie",
        ],
        answerIndex: 1,
      },
    ],
  },
};
