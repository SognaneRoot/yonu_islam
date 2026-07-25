import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

const PAYPAL_ENV = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
const PAYPAL_API =
  PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("PayPal n'est pas configuré côté serveur.");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Impossible d'obtenir un jeton PayPal.");
  const json = await res.json();
  return json.access_token as string;
}

export async function POST(req: NextRequest) {
  try {
    const { uid, subscriptionID, plan } = await req.json();
    if (!uid || !subscriptionID || !plan) {
      return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: "Firebase Admin n'est pas configuré côté serveur (FIREBASE_SERVICE_ACCOUNT_KEY)." },
        { status: 500 }
      );
    }

    const accessToken = await getPayPalAccessToken();
    const subRes = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionID}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!subRes.ok) {
      return NextResponse.json({ error: "Abonnement PayPal introuvable." }, { status: 400 });
    }
    const sub = await subRes.json();

    if (sub.status !== "ACTIVE") {
      return NextResponse.json({ error: `Statut PayPal non actif : ${sub.status}` }, { status: 400 });
    }

    const expiresAt: string | null = sub.billing_info?.next_billing_time || null;

    await db.collection("subscriptions").doc(uid).set(
      {
        plan,
        status: "active",
        provider: "paypal",
        reference: subscriptionID,
        expiresAt,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, expiresAt });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erreur serveur." }, { status: 500 });
  }
}
