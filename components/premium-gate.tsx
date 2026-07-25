"use client";

import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/subscription";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

// Interrupteur général : tant que PayPal/Stripe ne sont pas prêts, mets
// NEXT_PUBLIC_PREMIUM_ENFORCEMENT sur autre chose que "true" (ou ne la définis pas)
// pour que TOUT le contenu reste ouvert, sans rien casser pour les utilisateurs actuels.
const ENFORCED = process.env.NEXT_PUBLIC_PREMIUM_ENFORCEMENT === "true";

export function PremiumGate({
  children,
  label = "Contenu réservé aux abonnés",
  compact = false,
}: {
  children: React.ReactNode;
  label?: string;
  compact?: boolean;
}) {
  const { firebaseReady } = useAuth();
  const { hasPremium, loading } = useSubscription();

  if (!ENFORCED || !firebaseReady) return <>{children}</>;
  if (loading) return null;
  if (hasPremium) return <>{children}</>;

  if (compact) {
    return (
      <Link
        href="/abonnement"
        className="flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:underline"
      >
        <Lock size={13} /> Réservé aux abonnés
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold-500/20 bg-gold-500/5 p-8 text-center">
      <Lock size={22} className="text-gold-400" />
      <p className="text-sm text-beige-100">{label}</p>
      <Link
        href="/abonnement"
        className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2 text-sm font-medium text-night-800 hover:bg-gold-400"
      >
        <Sparkles size={14} /> Débloquer avec l'abonnement
      </Link>
    </div>
  );
}
