export type Step = {
  id: string;
  number: number;
  title: string;
  description: string;
  image: string; // path under /public, e.g. /assets/wuduh/w1.png
};

export const WUDU_STEPS: Step[] = [
  {
    id: "w1",
    number: 1,
    title: "Intention et Bismillah",
    description: "Former l'intention de faire le wudu dans le cœur, puis dire « Bismillah » avant de commencer.",
    image: "/assets/wuduh/w1.png",
  },
  {
    id: "w2",
    number: 2,
    title: "Laver les mains",
    description: "Laver les deux mains jusqu'aux poignets, trois fois, en commençant par la droite.",
    image: "/assets/wuduh/w2.png",
  },
  {
    id: "w3",
    number: 3,
    title: "Rincer la bouche et le nez",
    description: "Rincer la bouche (madmada) puis faire pénétrer l'eau dans le nez et la rejeter (istinshaq), trois fois.",
    image: "/assets/wuduh/w3.png",
  },
  {
    id: "w4",
    number: 4,
    title: "Laver le visage",
    description: "Laver l'ensemble du visage, du haut du front au bas du menton, d'une oreille à l'autre, trois fois.",
    image: "/assets/wuduh/w4.png",
  },
  {
    id: "w5",
    number: 5,
    title: "Laver les avant-bras",
    description: "Laver le bras droit puis le bras gauche jusqu'aux coudes inclus, trois fois chacun.",
    image: "/assets/wuduh/w5.png",
  },
  {
    id: "w6",
    number: 6,
    title: "Essuyer la tête et les oreilles",
    description: "Passer les mains mouillées sur l'ensemble de la tête une fois, puis essuyer l'intérieur et l'extérieur des oreilles.",
    image: "/assets/wuduh/w6.png",
  },
  {
    id: "w7",
    number: 7,
    title: "Laver les pieds",
    description: "Laver le pied droit puis le pied gauche jusqu'aux chevilles incluses, trois fois chacun, sans oublier entre les orteils.",
    image: "/assets/wuduh/w7.png",
  },
  {
    id: "w8",
    number: 8,
    title: "Invocation finale",
    description: "Lever le regard ou le doigt et prononcer l'attestation de foi (chahada) à la fin du wudu.",
    image: "/assets/wuduh/w8.png",
  },
];

export const PRAYER_STEPS: Step[] = [
  {
    id: "p1",
    number: 1,
    title: "Intention (niyyah)",
    description: "Former dans le cœur l'intention de la prière précise que l'on va accomplir, sans la prononcer à voix haute.",
    image: "/assets/priere/p1.png",
  },
  {
    id: "p2",
    number: 2,
    title: "Takbir d'ouverture",
    description: "Lever les mains à hauteur des épaules ou des oreilles et dire « Allahu Akbar » pour entrer en état de prière.",
    image: "/assets/priere/p2.png",
  },
  {
    id: "p3",
    number: 3,
    title: "Position debout (qiyam)",
    description: "Réciter la Fatiha puis, si possible, une sourate ou des versets supplémentaires.",
    image: "/assets/priere/p3.png",
  },
  {
    id: "p4",
    number: 4,
    title: "Inclinaison (ruku')",
    description: "S'incliner, dos droit, mains sur les genoux, en disant « Subhana Rabbiya-l-Adhim ».",
    image: "/assets/priere/p4.png",
  },
  {
    id: "p5",
    number: 5,
    title: "Redressement (i'tidal)",
    description: "Se redresser en disant « Sami'a Llahu liman hamidah », puis « Rabbana wa laka-l-hamd ».",
    image: "/assets/priere/p5.png",
  },
  {
    id: "p6",
    number: 6,
    title: "Première prosternation (sujud)",
    description: "Se prosterner sur les sept membres en disant « Subhana Rabbiya-l-A'la ».",
    image: "/assets/priere/p6.png",
  },
  {
    id: "p7",
    number: 7,
    title: "Position assise entre les deux prosternations",
    description: "S'asseoir brièvement en disant « Rabbi-ghfir li » avant la seconde prosternation.",
    image: "/assets/priere/p7.png",
  },
  {
    id: "p8",
    number: 8,
    title: "Deuxième prosternation",
    description: "Se prosterner à nouveau de la même manière que la première prosternation.",
    image: "/assets/priere/p8.png",
  },
  {
    id: "p9",
    number: 9,
    title: "Tashahhud",
    description: "S'asseoir et réciter le tashahhud ; à la dernière unité, ajouter la prière sur le Prophète ﷺ.",
    image: "/assets/priere/p9.png",
  },
  {
    id: "p10",
    number: 10,
    title: "Salut final (taslim)",
    description: "Tourner la tête à droite puis à gauche en disant « As-salamu alaykum wa rahmatullah » à chaque fois.",
    image: "/assets/priere/p10.png",
  },
];
