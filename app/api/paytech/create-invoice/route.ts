export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUid } from "@/lib/verify-request";
import { isPaytechConfigured, getPaytechHeaders } from "@/lib/paytech";
import { PLANS, PlanId } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    if (!isPaytechConfigured()) {
      return NextResponse.json({ error: "PayTech n'est pas configuré côté serveur." }, { status: 500 });
    }
    const uid = await getVerifiedUid(req);
    if (!uid) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const { plan } = (await req.json()) as { plan: PlanId };
    const planInfo = PLANS.find((p) => p.id === plan);
    if (!planInfo) return NextResponse.json({ error: "Plan invalide." }, { status: 400 });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "";
    // Référence unique et traçable : contient uid + plan pour retrouver le contexte
    // même si custom_field était perdu, et sert de clé d'idempotence.
    const refCommand = `MCVA-${uid}-${plan}-${Date.now()}`;

    const res = await fetch("https://paytech.sn/api/payment/request-payment", {
      method: "POST",
      headers: getPaytechHeaders(),
      body: JSON.stringify({
        item_name: `Abonnement ${planInfo.label}`,
        item_price: planInfo.priceFcfa,
        currency: "XOF",
        ref_command: refCommand,
        command_name: `Abonnement Mon Chemin vers Allah — ${planInfo.label}`,
        env: process.env.PAYTECH_ENV === "prod" ? "prod" : "test",
        target_payment: "Orange Money, Wave",
        ipn_url: `${origin}/api/paytech/ipn`,
        success_url: `${origin}/abonnement?checkout=success`,
        cancel_url: `${origin}/abonnement?checkout=cancelled`,
        custom_field: JSON.stringify({ uid, plan }),
      }),
    });

    const json = await res.json();
    if (json.success !== 1) {
      return NextResponse.json({ error: json.message || "Échec PayTech." }, { status: 400 });
    }

    return NextResponse.json({ url: json.redirect_url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erreur serveur." }, { status: 500 });
  }
}