export type PlanId = "monthly" | "annual";

// ⚠️ Prix d'exemple — à ajuster selon ta tarification réelle.
export const PLANS: { id: PlanId; label: string; priceFcfa: number; period: string }[] = [
  { id: "monthly", label: "Mensuel", priceFcfa: 1500, period: "/ mois" },
  { id: "annual", label: "Annuel", priceFcfa: 14000, period: "/ an" },
];