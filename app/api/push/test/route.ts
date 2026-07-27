export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getVerifiedUid } from "@/lib/verify-request";
import webpush from "web-push";

export async function POST(req: NextRequest) {
  try {
    const uid = await getVerifiedUid(req);
    if (!uid) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const pub = process.env.VAPID_PUBLIC_KEY;
    const priv = process.env.VAPID_PRIVATE_KEY;
    if (!pub || !priv) {
      return NextResponse.json({ error: "VAPID non configuré côté serveur." }, { status: 500 });
    }
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:contact@example.com", pub, priv);

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "Firebase Admin non configuré." }, { status: 500 });

    const snap = await db.collection("push_subscriptions").doc(uid).get();
    const subscription = snap.data()?.subscription;
    if (!subscription) {
      return NextResponse.json(
        { error: "Aucun abonnement push enregistré pour ce compte. Active d'abord un rappel." },
        { status: 400 }
      );
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title: "Test", body: "Si tu vois ceci, les notifications fonctionnent ✅" })
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Échec du test push :", err?.statusCode, err?.body || err?.message);
    return NextResponse.json(
      { error: `Échec de l'envoi : ${err?.body || err?.message || "erreur inconnue"}` },
      { status: 500 }
    );
  }
}
