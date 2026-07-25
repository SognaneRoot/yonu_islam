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

export const metadata: Metadata = {
  title: "Mon Chemin vers Allah",
  description:
    "Un compagnon quotidien pour apprendre, se purifier et progresser vers Allah — prière, Coran, adhkar, habitudes et bien plus.",
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
};

export const viewport: Viewport = {
  themeColor: "#0F3D2E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`dark ${fraunces.variable} ${inter.variable} ${amiri.variable}`}>
      <body className="font-body">
        <RegisterServiceWorker />
        <AuthProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
