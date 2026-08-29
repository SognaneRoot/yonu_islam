export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { sendConfirmationEmail, subscriptionConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const raw = form.get("data");
    if (!raw) return NextResponse.json({ error: "Données manquantes." }, { status: 400 });

    const payload = JSON.parse(raw.toString());
    const expectedHash = crypto.createHash("sha512").update(process.env.PAYDUNYA_MASTER_KEY!).digest("hex");
    if (payload.hash !== expectedHash) {
      return NextResponse.json({ error: "Hash invalide." }, { status: 403 });
    }

    if (payload.status !== "completed") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const uid = payload.custom_data?.uid;
    const plan = payload.custom_data?.plan;
    if (!uid || !plan) return NextResponse.json({ error: "custom_data manquant." }, { status: 400 });

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "Firebase Admin non configuré." }, { status: 500 });

    const days = plan === "annual" ? 365 : 30;
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

    await db.collection("subscriptions").doc(uid).set(
      { plan, status: "active", provider: "paydunya", reference: payload.invoice_token, expiresAt, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    const auth = (await import("@/lib/firebase/admin")).getAdminAuth();
    const userRecord = auth ? await auth.getUser(uid).catch(() => null) : null;
    if (userRecord?.email) {
      const { subject, html } = subscriptionConfirmationEmail(plan);
      await sendConfirmationEmail(userRecord.email, subject, html);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erreur serveur." }, { status: 500 });
  }
}
