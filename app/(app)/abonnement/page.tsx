"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { PLANS, PlanId, useSubscription } from "@/lib/subscription";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_PLAN_IDS: Record<PlanId, string | undefined> = {
  monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY,
  annual: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ANNUAL,
};

export default function AbonnementPage() {
  const { user, firebaseReady, loading: authLoading } = useAuth();
  const { subscription, hasPremium, loading: subLoading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("monthly");
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!firebaseReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comptes non configurés</CardTitle>
          <CardDescription>
            Configure Firebase (variables d'environnement) pour activer les comptes et les
            abonnements — voir le README.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connecte-toi pour t'abonner</CardTitle>
          <CardDescription>Un compte est nécessaire pour gérer ton abonnement.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/compte">
            <Button>Se connecter / Créer un compte</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  async function startStripeCheckout() {
    setError(null);
    setStripeLoading(true);
    try {
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ email: user!.email, plan: selectedPlan }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error || "Impossible de démarrer le paiement Stripe.");
      }
    } catch {
      setError("Impossible de démarrer le paiement Stripe.");
    } finally {
      setStripeLoading(false);
    }
  }
  async function startPaytechCheckout(method: "Wave" | "Orange Money") {
    setError(null);
    const idToken = await user!.getIdToken();
    const res = await fetch("/api/paytech/create-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ plan: selectedPlan, method }),
    });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
    else setError(json.error || "Impossible de démarrer le paiement.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Abonnement</h1>
        <p className="mt-1 text-sm text-sand-400">Débloque l'accès complet à Mon Chemin vers Allah</p>
      </div>

      {hasPremium && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <div>
              <p className="text-sm text-beige-50">
                Abonnement actif — plan {subscription.plan === "annual" ? "annuel" : "mensuel"}
              </p>
              {subscription.expiresAt && (
                <p className="text-xs text-sand-400">
                  Renouvellement le {new Date(subscription.expiresAt).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!hasPremium && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`rounded-2xl border p-5 text-left transition-colors ${
                  selectedPlan === plan.id
                    ? "border-gold-500/50 bg-gold-500/10"
                    : "border-white/8 bg-night-600/40 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-beige-50">{plan.label}</span>
                  {plan.id === "annual" && <Badge variant="gold">Meilleure offre</Badge>}
                </div>
                <p className="mt-2 text-2xl text-beige-50">
                  {plan.priceFcfa.toLocaleString("fr-FR")} FCFA
                  <span className="text-sm text-sand-400"> {plan.period}</span>
                </p>
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={16} className="text-gold-400" /> Carte bancaire (Stripe)
                </CardTitle>
                <CardDescription>Visa, Mastercard — paiement sécurisé</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={startStripeCheckout} disabled={stripeLoading} className="w-full">
                  {stripeLoading ? <Loader2 size={16} className="animate-spin" /> : "Payer par carte"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PayPal</CardTitle>
                <CardDescription>Paiement récurrent via ton compte PayPal</CardDescription>
              </CardHeader>
              <CardContent>
                {PAYPAL_CLIENT_ID && PAYPAL_PLAN_IDS[selectedPlan] ? (
                  <PayPalScriptProvider
                    options={{ clientId: PAYPAL_CLIENT_ID, vault: true, intent: "subscription" }}
                  >
                    <PayPalButtons
                      style={{ layout: "horizontal", label: "subscribe" }}
                      createSubscription={(_, actions) =>
                        actions.subscription.create({ plan_id: PAYPAL_PLAN_IDS[selectedPlan]! })
                      }
                      onApprove={async (data) => {
                        setError(null);
                        const idToken = await user!.getIdToken();
                        const res = await fetch("/api/paypal/confirm", {
                          method: "POST",
                          headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
                          body: JSON.stringify({
                            subscriptionID: data.subscriptionID,
                            plan: selectedPlan,
                          }),
                        });
                        const json = await res.json();
                        if (json.error) setError(json.error);
                      }}
                      onError={() => setError("Le paiement PayPal a échoué.")}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <p className="text-xs text-sand-400">
                    PayPal n'est pas encore configuré (variables d'environnement manquantes).
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mobile Money</CardTitle>
                <CardDescription>Paiement direct via PayTech</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => startPaytechCheckout("Wave")} variant="secondary" className="w-full">
                  Payer par Wave
                </Button>
                <Button onClick={() => startPaytechCheckout("Orange Money")} variant="secondary" className="w-full">
                  Payer par Orange Money
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
