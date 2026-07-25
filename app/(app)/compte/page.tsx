"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/subscription";
import Link from "next/link";
import { useState } from "react";
import { LogOut, Mail, ShieldCheck, Sparkles } from "lucide-react";

export default function ComptePage() {
  const { user, loading, firebaseReady, signIn, signUp, logout } = useAuth();
  const { hasPremium } = useSubscription();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!firebaseReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comptes non configurés</CardTitle>
          <CardDescription>
            L'application fonctionne pour l'instant en mode local uniquement. Configure Firebase
            (variables d'environnement) pour activer les comptes — voir le README.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) return null;

  if (user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl text-beige-50">Mon compte</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div>
              <p className="text-beige-50">{user.displayName || user.email}</p>
              <p className="text-sm text-sand-400">{user.email}</p>
            </div>
            <Button variant="outline" onClick={() => logout()}>
              <LogOut size={16} /> Se déconnecter
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold-400" /> Abonnement
            </CardTitle>
            <CardDescription>
              {hasPremium ? "Ton abonnement est actif." : "Aucun abonnement actif pour le moment."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/abonnement">
              <Button variant="secondary">Gérer mon abonnement</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, name || undefined);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(translateAuthError(err?.code) || "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="mt-1 text-sm text-sand-400">
          {mode === "login"
            ? "Retrouve ta progression sur tous tes appareils."
            : "Sauvegarde ta progression et débloque l'abonnement."}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton prénom"
                className="w-full rounded-xl border border-white/8 bg-night-700/50 px-3.5 py-2.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full rounded-xl border border-white/8 bg-night-700/50 px-3.5 py-2.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe (6 caractères min.)"
              className="w-full rounded-xl border border-white/8 bg-night-700/50 px-3.5 py-2.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
            />
            {error && <p className="text-xs text-red-300">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full">
              <Mail size={16} /> {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-center text-xs text-gold-400 hover:underline"
          >
            {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </CardContent>
      </Card>

      <p className="flex items-center gap-1.5 text-xs text-sand-500">
        <ShieldCheck size={13} /> Tes données restent privées et liées uniquement à ton compte.
      </p>
    </div>
  );
}

function translateAuthError(code?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Cet email est déjà utilisé.";
    case "auth/invalid-email":
      return "Adresse email invalide.";
    case "auth/weak-password":
      return "Mot de passe trop court (6 caractères minimum).";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email ou mot de passe incorrect.";
    default:
      return null;
  }
}
