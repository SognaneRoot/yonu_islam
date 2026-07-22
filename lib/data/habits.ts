export type HabitDef = {
  id: string;
  label: string;
  icon: string;
};

export const DEFAULT_HABITS: HabitDef[] = [
  { id: "fajr", label: "Fajr à l'heure", icon: "sunrise" },
  { id: "coran", label: "Lecture du Coran", icon: "book-open" },
  { id: "dhikr", label: "Dhikr", icon: "sparkles" },
  { id: "salawat", label: "Salat sur le Prophète ﷺ", icon: "heart" },
  { id: "istighfar", label: "Astaghfirullah", icon: "refresh-ccw" },
  { id: "sport", label: "Sport", icon: "dumbbell" },
  { id: "etude", label: "Étude", icon: "graduation-cap" },
  { id: "sadaqa", label: "Sadaqa", icon: "hand-heart" },
];
