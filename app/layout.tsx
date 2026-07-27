import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Amiri } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth-context";
import { RegisterServiceWorker } from "@/components/register-service-worker";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mon-chemin-vers-allah.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mon Chemin vers Allah",
    template: "%s",
  },
  description:
    "Un compagnon quotidien pour apprendre, se purifier et progresser vers Allah — prière, Coran, adhkar, habitudes et bien plus.",
  keywords: [
    "apprendre à prier",
    "wudu étapes",
    "ablutions islam",
    "adhkar matin soir",
    "cours coran en ligne",
    "aqida tawhid",
    "hadith 40 nawawi",
    "fiqh islam",
    "sira prophète",
    "application islam français",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mon Chemin",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Mon Chemin vers Allah",
    title: "Mon Chemin vers Allah",
    description:
      "Un compagnon quotidien pour apprendre, se purifier et progresser vers Allah — prière, Coran, adhkar, habitudes et bien plus.",
    url: SITE_URL,
    images: [{ url: "/icon-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Mon Chemin vers Allah",
    description:
      "Un compagnon quotidien pour apprendre, se purifier et progresser vers Allah — prière, Coran, adhkar, habitudes et bien plus.",
    images: ["/icon-512.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F3D2E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Mon Chemin vers Allah",
        url: SITE_URL,
        description:
          "Un compagnon quotidien pour apprendre, se purifier et progresser vers Allah — prière, Coran, adhkar, habitudes et bien plus.",
        inLanguage: "fr-FR",
      },
      {
        "@type": "Organization",
        name: "Mon Chemin vers Allah",
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
      },
    ],
  };

  return (
    <html lang="fr" className={`dark ${fraunces.variable} ${inter.variable} ${amiri.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body">
        <RegisterServiceWorker />
        <AuthProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
