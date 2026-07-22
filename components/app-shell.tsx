"use client";

import { useAppData } from "@/lib/store";
import { levelForXp } from "@/lib/data/levels";
import { Sidebar } from "./sidebar";
import { Flame, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data, ready } = useAppData();
  const { current } = levelForXp(data.xp);

  return (
    <div className="min-h-screen bg-night-700 text-beige-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/8 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-white/8">
            <div className="flex justify-end p-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-sand-400 hover:bg-white/5"
                aria-label="Fermer le menu"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/8 bg-night-700/85 px-4 py-3 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-sand-400 hover:bg-white/5 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
          <span className="hidden text-sm text-sand-400 lg:block">
            Niveau {current.id} · <span className="text-beige-100">{current.title}</span>
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-night-600/60 px-3 py-1.5 text-sm">
              <Flame size={15} className="text-gold-400" />
              <span className="tabular-nums text-beige-100">{ready ? data.streakDays : 0}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-gold-500/25 bg-gold-500/10 px-3 py-1.5 text-sm">
              <Sparkles size={15} className="text-gold-400" />
              <span className="tabular-nums text-gold-300">{ready ? data.xp : 0} XP</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
