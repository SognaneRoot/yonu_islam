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
    ],
  },
  ablutions: {
    slug: "ablutions",
    title: "Les ablutions (wudu)",
    tagline: "Obligations, sunnan et annulatifs",
    icon: "droplets",
    color: "night",
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
    ],
  },
  purification: {
    slug: "purification",
    title: "Purification du cœur",
    tagline: "Sincérité, patience, gratitude, confiance en Allah",
    icon: "sparkles",
    color: "emerald",
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
    ],
  },
  arabe: {
    slug: "arabe",
    title: "Arabe coranique",
    tagline: "Alphabet, lecture, écriture, vocabulaire, grammaire",
    icon: "languages",
    color: "emerald",
    sections: [
      { id: "alphabet", title: "Alphabet", content: ["Les 28 lettres de l'alphabet arabe, leurs formes isolée, initiale, médiane et finale."] },
      { id: "lecture", title: "Lecture", content: ["Assemblage des lettres, voyelles courtes (harakat) et longues, règles de base du tajwid."] },
      { id: "vocabulaire", title: "Vocabulaire coranique", content: ["Les racines et mots les plus fréquents du Coran, appris par groupes thématiques."] },
      { id: "grammaire", title: "Grammaire", content: ["Notions de base : nom, verbe, particule, déclinaison (i'rab) et conjugaison simple."] },
    ],
    quiz: [
      {
        id: "q1",
        question: "L'alphabet arabe comporte combien de lettres ?",
        options: ["24", "26", "28", "30"],
        answerIndex: 2,
      },
    ],
  },
};
