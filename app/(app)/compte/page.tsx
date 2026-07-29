"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/subscription";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AlertTriangle, LogOut, Mail, ShieldCheck, Sparkles, Trash2 } from "lucide-react";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

export default function ComptePage() {
  const { user, loading, firebaseReady, signIn, signUp, logout, resetPassword, resendVerificationEmail, deleteAccount } =
    useAuth();
  const { hasPremium } = useSubscription();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

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
    async function handleDelete() {
      setDeleteError(null);
      try {
        await deleteAccount();
      } catch (err: any) {
        if (err?.code === "auth/requires-recent-login") {
          setDeleteError(
            "Pour ta sécurité, reconnecte-toi (déconnexion puis connexion) avant de supprimer ton compte."
          );
        } else {
          setDeleteError("Impossible de supprimer le compte pour le moment.");
        }
      }
    }

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

        {!user.emailVerified && (
          <Card className="border-gold-500/25 bg-gold-500/5">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-sm text-beige-100">Email non confirmé</p>
                <p className="text-xs text-sand-400">
                  Vérifie ta boîte mail pour confirmer ton adresse ({user.email}).
                </p>
              </div>
              {verifySent ? (
                <span className="text-xs text-emerald-300">Email renvoyé ✓</span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={verifyBusy}
                  onClick={async () => {
                    setVerifyBusy(true);
                    try {
                      await resendVerificationEmail();
                      setVerifySent(true);
                    } finally {
                      setVerifyBusy(false);
                    }
                  }}
                >
                  Renvoyer l'email
                </Button>
              )}
            </CardContent>
          </Card>
        )}
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

        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-300">
              <AlertTriangle size={16} /> Zone de danger
            </CardTitle>
            <CardDescription>
              Supprime définitivement ton compte et toutes tes données (progression, journal,
              abonnement, rappels). Cette action est irréversible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {deleteError && <p className="text-xs text-red-300">{deleteError}</p>}
            {!confirmDelete ? (
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={16} /> Supprimer mon compte
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-beige-100">Es-tu sûr ? Cette action ne peut pas être annulée.</p>
                <div className="flex gap-2">
                  <Button variant="danger" onClick={handleDelete}>
                    Oui, tout supprimer
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && !acceptedTerms) {
      setError("Merci d'accepter les conditions d'utilisation pour créer un compte.");
      return;
    }
    if (mode === "signup" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaToken) {
      setError("Merci de compléter le reCAPTCHA.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        if (captchaToken) {
          const verifyRes = await fetch("/api/auth/verify-captcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: captchaToken }),
          });
          const verifyJson = await verifyRes.json();
          if (!verifyJson.success) {
            setError("Vérification reCAPTCHA échouée, réessaie.");
            setCaptchaKey((k) => k + 1);
            setCaptchaToken(null);
            setBusy(false);
            return;
          }
        }
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

  async function handleForgotPassword() {
    setError(null);
    setResetSent(false);
    if (!email) {
      setError("Renseigne ton email ci-dessus, puis clique à nouveau sur ce lien.");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(translateAuthError(err?.code) || "Impossible d'envoyer l'email de réinitialisation.");
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
            {resetSent && (
              <p className="text-xs text-emerald-300">
                Email envoyé — vérifie ta boîte de réception pour réinitialiser ton mot de passe.
              </p>
            )}
            {mode === "login" && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-gold-400 hover:underline"
              >
                Mot de passe oublié ?
              </button>
            )}
            {mode === "signup" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <ReCAPTCHA
                key={captchaKey}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            )}
            {mode === "signup" && (
              <label className="flex items-start gap-2 text-xs text-sand-400">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 accent-gold-500"
                />
                <span>
                  J'accepte les{" "}
                  <Link href="/conditions" target="_blank" className="text-gold-400 hover:underline">
                    Conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/confidentialite" target="_blank" className="text-gold-400 hover:underline">
                    Politique de confidentialité
                  </Link>
                  .
                </span>
              </label>
            )}
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
