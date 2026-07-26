import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mon-chemin-vers-allah.vercel.app";

const routes = [
  { path: "", priority: 1, freq: "daily" as const },
  { path: "/niveaux", priority: 0.7, freq: "weekly" as const },
  { path: "/priere", priority: 0.9, freq: "monthly" as const },
  { path: "/ablutions", priority: 0.9, freq: "monthly" as const },
  { path: "/adhkar", priority: 0.8, freq: "monthly" as const },
  { path: "/coran", priority: 0.8, freq: "weekly" as const },
  { path: "/aqida", priority: 0.8, freq: "monthly" as const },
  { path: "/purification", priority: 0.7, freq: "monthly" as const },
  { path: "/hadith", priority: 0.8, freq: "monthly" as const },
  { path: "/sira", priority: 0.7, freq: "monthly" as const },
  { path: "/fiqh", priority: 0.8, freq: "monthly" as const },
  { path: "/arabe", priority: 0.7, freq: "monthly" as const },
  { path: "/habitudes", priority: 0.6, freq: "weekly" as const },
  { path: "/combat", priority: 0.6, freq: "monthly" as const },
  { path: "/bibliotheque", priority: 0.8, freq: "weekly" as const },
  { path: "/conditions", priority: 0.3, freq: "yearly" as const },
  { path: "/confidentialite", priority: 0.3, freq: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
