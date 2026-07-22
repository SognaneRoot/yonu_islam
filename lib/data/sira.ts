export type SiraEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
};

export const SIRA_TIMELINE: SiraEvent[] = [
  { id: "naissance", year: "570", title: "Naissance", description: "Naissance du Prophète Muhammad ﷺ à La Mecque, dans la tribu de Quraysh, l'année de l'éléphant." },
  { id: "revelation", year: "610", title: "Révélation", description: "Première révélation dans la grotte de Hira : le début de la mission prophétique." },
  { id: "hijra", year: "622", title: "Hijra", description: "Émigration de La Mecque vers Médine, marquant le début du calendrier hégirien." },
  { id: "badr", year: "624", title: "Bataille de Badr", description: "Première grande bataille entre les musulmans de Médine et les Quraysh de La Mecque." },
  { id: "uhud", year: "625", title: "Bataille d'Uhud", description: "Bataille marquée par des leçons sur la discipline et l'obéissance." },
  { id: "khandaq", year: "627", title: "Bataille du Fossé (Khandaq)", description: "Défense de Médine grâce à la stratégie du fossé proposée par Salman al-Farisi." },
  { id: "hudaybiya", year: "628", title: "Traité de Hudaybiya", description: "Accord de paix avec les Quraysh qui ouvrira la voie à la propagation pacifique de l'islam." },
  { id: "conquete", year: "630", title: "Conquête de La Mecque", description: "Entrée pacifique à La Mecque et purification de la Kaaba des idoles." },
  { id: "adieu", year: "632", title: "Sermon d'adieu", description: "Dernier sermon du Prophète ﷺ lors du pèlerinage d'adieu, résumant les principes de l'islam." },
];
