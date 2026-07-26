import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getVerifiedUid } from "@/lib/verify-request";

export async function POST(req: NextRequest) {
  try {
    const uid = await getVerifiedUid(req);
    if (!uid) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { email, plan } = await req.json();
    if (!plan) {
      return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe n'est pas configuré côté serveur." }, { status: 500 });
    }

    const priceId =
      plan === "annual" ? process.env.STRIPE_PRICE_ANNUAL : process.env.STRIPE_PRICE_MONTHLY;
    if (!priceId) {
      return NextResponse.json(
        { error: `Aucun Price ID Stripe configuré pour le plan "${plan}".` },
        { status: 500 }
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      client_reference_id: uid,
      metadata: { uid, plan },
      subscription_data: { metadata: { uid, plan } },
      success_url: `${origin}/abonnement?checkout=success`,
      cancel_url: `${origin}/abonnement?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erreur serveur." }, { status: 500 });
  }
}
