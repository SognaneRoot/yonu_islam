import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase/admin";
import { sendConfirmationEmail, subscriptionConfirmationEmail } from "@/lib/email";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const db = getAdminDb();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !db || !webhookSecret) {
    return NextResponse.json({ error: "Stripe/Firebase Admin non configurés." }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Signature invalide : ${err.message}` }, { status: 400 });
  }

  async function setSubscription(
    uid: string,
    data: { plan?: string; status: "active" | "expired"; reference?: string; expiresAt?: string | null }
  ) {
    await db!.collection("subscriptions").doc(uid).set(
      {
        provider: "stripe",
        updatedAt: new Date().toISOString(),
        ...data,
      },
      { merge: true }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id || session.metadata?.uid;
      const plan = session.metadata?.plan;
      if (uid && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        const periodEnd = sub.items.data[0]?.current_period_end;
        await setSubscription(uid, {
          plan,
          status: "active",
          reference: sub.id,
          expiresAt: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        });

        const email = session.customer_details?.email || session.customer_email;
        if (email) {
          const { subject, html } = subscriptionConfirmationEmail(plan || "monthly");
          await sendConfirmationEmail(email, subject, html);
        }
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const uid = sub.metadata?.uid;
      if (uid) {
        const active = sub.status === "active" || sub.status === "trialing";
        const periodEnd = sub.items.data[0]?.current_period_end;
        await setSubscription(uid, {
          plan: sub.metadata?.plan,
          status: active ? "active" : "expired",
          reference: sub.id,
          expiresAt: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const uid = sub.metadata?.uid;
      if (uid) {
        await setSubscription(uid, { status: "expired", reference: sub.id });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
