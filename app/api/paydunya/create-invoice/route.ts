export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUid } from "@/lib/verify-request";
import { getPaydunyaHeaders, getPaydunyaBaseUrl, isPaydunyaConfigured } from "@/lib/paydunya";
import { PLANS } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    if (!isPaydunyaConfigured()) {
      return NextResponse.json({ error: "PayDunya n'est pas configuré côté serveur." }, { status: 500 });
    }
    const uid = await getVerifiedUid(req);
    if (!uid) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const { plan } = await req.json();
    const planInfo = PLANS.find((p) => p.id === plan);
    if (!planInfo) return NextResponse.json({ error: "Plan invalide." }, { status: 400 });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "";

    const res = await fetch(`${getPaydunyaBaseUrl()}/checkout-invoice/create`, {
      method: "POST",
      headers: getPaydunyaHeaders(),
      body: JSON.stringify({
        invoice: {
          total_amount: planInfo.priceFcfa,
          description: `Abonnement Mon Chemin vers Allah — ${planInfo.label}`,
          custom_data: { uid, plan },
        },
        store: { name: "Mon Chemin vers Allah" },
        actions: {
          cancel_url: `${origin}/abonnement?checkout=cancelled`,
          return_url: `${origin}/abonnement?checkout=success`,
          callback_url: `${origin}/api/paydunya/webhook`,
        },
      }),
    });
    const json = await res.json();

    if (json.response_code !== "00") {
      return NextResponse.json({ error: json.response_text || "Échec PayDunya." }, { status: 400 });
    }

    return NextResponse.json({ url: json.response_text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erreur serveur." }, { status: 500 });
  }
}
