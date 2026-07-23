import type { Metadata } from "next";
import { Fraunces, Inter, Amiri } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/lib/store";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`dark ${fraunces.variable} ${inter.variable} ${amiri.variable}`}>
      <body className="font-body">
        <AppDataProvider>{children}</AppDataProvider>
      </body>
    </html>
  );
}
