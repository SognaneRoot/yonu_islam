"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { CloudOff, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function ComptePage() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function sendMagicLink() {
    if (!supabase || !email) return;
    await supabase.auth.signInWithOtp({ email });
    setSent(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Mon compte</h1>
        <p className="mt-1 text-sm text-sand-400">Sauvegarde cloud et synchronisation multi-appareils</p>
      </div>

      {!supabase ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudOff size={16} className="text-gold-400" /> Stockage local uniquement
            </CardTitle>
            <CardDescription>
              Tes données sont actuellement sauvegardées dans ton navigateur. Pour activer la
              synchronisation entre appareils, configure Supabase — voir le README.md du projet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" /> Connexion par lien magique
            </CardTitle>
            <CardDescription>Aucun mot de passe requis — reçois un lien par email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sent ? (
              <p className="text-sm text-emerald-300">Vérifie ta boîte mail pour te connecter.</p>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  className="flex-1 rounded-xl border border-white/8 bg-night-700/50 px-3.5 py-2.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
                />
                <Button onClick={sendMagicLink}>
                  <Mail size={16} /> Recevoir le lien
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
