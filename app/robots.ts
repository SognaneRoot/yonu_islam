import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mon-chemin-vers-allah.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/compte", "/abonnement", "/rappels", "/lecture"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
