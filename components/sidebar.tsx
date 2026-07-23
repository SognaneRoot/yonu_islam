"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  Layers,
  HandHeart,
  Droplets,
  Sparkles,
  BookOpen,
  BookMarked,
  ScrollText,
  Compass,
  Scale,
  Languages,
  ListChecks,
  ShieldHalf,
  Library,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/niveaux", label: "Niveaux", icon: Layers },
  { href: "/priere", label: "Prière", icon: HandHeart },
  { href: "/ablutions", label: "Ablutions", icon: Droplets },
  { href: "/adhkar", label: "Adhkar", icon: Sparkles },
  { href: "/coran", label: "Coran", icon: BookOpen },
  { href: "/aqida", label: "Aqida", icon: BookMarked },
  { href: "/purification", label: "Purification du cœur", icon: Sparkles },
  { href: "/hadith", label: "Hadith", icon: ScrollText },
  { href: "/sira", label: "Sira", icon: Compass },
  { href: "/fiqh", label: "Fiqh", icon: Scale },
  { href: "/arabe", label: "Arabe", icon: Languages },
  { href: "/habitudes", label: "Habitudes", icon: ListChecks },
  { href: "/combat", label: "Mon Combat", icon: ShieldHalf },
  { href: "/bibliotheque", label: "Bibliothèque", icon: Library },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-night-800">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-glow">
          <Moon className="h-4.5 w-4.5 text-gold-300" size={18} />
        </div>
        <div>
          <p className="font-display text-[15px] leading-tight text-beige-50">Mon Chemin</p>
          <p className="font-display text-[15px] leading-tight text-gold-400">vers Allah</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-emerald-500/15 text-beige-50"
                  : "text-sand-400 hover:bg-white/5 hover:text-beige-100"
              )}
            >
              <Icon
                size={17}
                className={cn(active ? "text-gold-400" : "text-sand-500 group-hover:text-gold-400")}
              />
              <span className="truncate">{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-5 rounded-xl border border-gold-500/20 bg-gold-500/5 p-3.5">
        <p className="font-arabic text-right text-sm text-gold-300">رَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ</p>
        <p className="mt-1 text-xs text-sand-400">
          « Ma miséricorde englobe toute chose. » — Sourate Al-A'raf, 156
        </p>
      </div>
    </div>
  );
}
