export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase/admin";
import { verifyPaytechHmac, verifyPaytechSha256, decodeCustomField } from "@/lib/paytech";
import { sendConfirmationEmail, subscriptionConfirmationEmail } from "@/lib/email";
import { PLANS, PlanId } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    // PayTech envoie en application/x-www-form-urlencoded (formData couvre ce cas).
    const form = await req.formData();
    const data: Record<string, string> = {};
    form.forEach((v, k) => (data[k] = String(v)));

    const {
      type_event,
      custom_field,
      ref_command,
      item_price,
      final_item_price,
      payment_method,
      hmac_compute,
      api_key_sha256,
      api_secret_sha256,
    } = data;

    if (!ref_command) {
      return NextResponse.json({ error: "ref_command manquant." }, { status: 400 });
    }

    // 1. Vérifier l'authenticité — HMAC en priorité (recommandé par PayTech), repli SHA256.
    const amountForHmac = final_item_price || item_price;
    let authentic = false;
    if (hmac_compute) {
      authentic = verifyPaytechHmac(hmac_compute, amountForHmac, ref_command);
    } else if (api_key_sha256 && api_secret_sha256) {
      authentic = verifyPaytechSha256(api_key_sha256, api_secret_sha256);
    }
    if (!authentic) {
      console.error("PayTech IPN rejeté : signature invalide", { ref_command });
      return NextResponse.json({ error: "Signature invalide." }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "Firebase Admin non configuré." }, { status: 500 });

    // 2. Idempotence : ref_command comme id de document — si déjà traité, on renvoie OK sans rejouer.
    const paymentRef = db.collection("payments").doc(ref_command);
    const existing = await paymentRef.get();
    if (existing.exists && existing.data()?.status === "completed") {
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }

    if (type_event === "sale_canceled") {
      await paymentRef.set({
        provider: "paytech",
        providerReference: ref_command,
        status: "canceled",
        amount: Number(amountForHmac) || null,
        currency: "XOF",
        paymentMethod: payment_method || null,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true });
    }

    if (type_event !== "sale_complete") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // 3. Décoder custom_field et vérifier uid/plan
    const customData = custom_field ? decodeCustomField(custom_field) : null;
    const uid = customData?.uid;
    const plan = customData?.plan as PlanId | undefined;
    if (!uid || !plan) {
      console.error("PayTech IPN : custom_field invalide", { ref_command, custom_field });
      return NextResponse.json({ error: "custom_field invalide." }, { status: 400 });
    }

    // 4. Vérifier que le montant payé correspond bien au plan (protection anti-fraude)
    const planInfo = PLANS.find((p) => p.id === plan);
    const paidAmount = Number(amountForHmac);
    if (!planInfo || paidAmount !== planInfo.priceFcfa) {
      console.error("PayTech IPN : montant incohérent", { ref_command, paidAmount, expected: planInfo?.priceFcfa });
      await paymentRef.set({
        provider: "paytech",
        providerReference: ref_command,
        status: "amount_mismatch",
        amount: paidAmount,
        currency: "XOF",
        uid,
        plan,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ error: "Montant incohérent." }, { status: 400 });
    }

    // 5. Activer l'abonnement
    const days = plan === "annual" ? 365 : 30;
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

    await db.collection("subscriptions").doc(uid).set(
      { plan, status: "active", provider: "paytech", reference: ref_command, expiresAt, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    // 6. Log d'audit (permet de diagnostiquer sans stocker de données sensibles superflues)
    await paymentRef.set({
      provider: "paytech",
      providerReference: ref_command,
      status: "completed",
      amount: paidAmount,
      currency: "XOF",
      paymentMethod: payment_method || null,
      uid,
      plan,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // 7. Email de confirmation
    const auth = getAdminAuth();
    const userRecord = auth ? await auth.getUser(uid).catch(() => null) : null;
    if (userRecord?.email) {
      const { subject, html } = subscriptionConfirmationEmail(plan);
      await sendConfirmationEmail(userRecord.email, subject, html);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Erreur IPN PayTech :", err?.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}