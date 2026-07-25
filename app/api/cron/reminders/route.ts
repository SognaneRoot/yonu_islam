import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import webpush from "web-push";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

const WINDOW_MINUTES = 7; // tolérance autour de l'heure cible (le cron tourne ~ toutes les 15 min)

function configureWebPush() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:contact@example.com";
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  return true;
}

function todayKeyInTz(tz: string) {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date());
  }
}

function nowHHmmInTz(tz: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(
      new Date()
    );
  } catch {
    return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: false }).format(
      new Date()
    );
  }
}

function minutesDiff(a: string, b: string) {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return Math.abs(ah * 60 + am - (bh * 60 + bm));
}

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;
  const querySecret = req.nextUrl.searchParams.get("secret");
  return querySecret === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase Admin non configuré." }, { status: 500 });
  if (!configureWebPush()) return NextResponse.json({ error: "VAPID non configuré." }, { status: 500 });

  const snap = await db.collection("push_subscriptions").get();
  let sent = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data() as any;
    if (!data.subscription) continue;

    const tz = data.timezone || "UTC";
    const lastSent: Record<string, string> = data.lastSent || {};
    const updates: Record<string, string> = {};
    const todayKey = todayKeyInTz(tz);
    const nowHHmm = nowHHmmInTz(tz);

    async function trySend(type: string, title: string, body: string) {
      if (lastSent[type] === todayKey) return;
      try {
        await webpush.sendNotification(data.subscription, JSON.stringify({ title, body }));
        updates[type] = todayKey;
        sent++;
      } catch (err: any) {
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await docSnap.ref.set({ subscription: null }, { merge: true });
        }
      }
    }

    if (data.adhkarMatinEnabled && minutesDiff(nowHHmm, data.adhkarMatinTime || "06:00") <= WINDOW_MINUTES) {
      await trySend("adhkarMatin", "Adhkar du matin", "C'est le moment de tes invocations du matin.");
    }
    if (data.adhkarSoirEnabled && minutesDiff(nowHHmm, data.adhkarSoirTime || "18:00") <= WINDOW_MINUTES) {
      await trySend("adhkarSoir", "Adhkar du soir", "C'est le moment de tes invocations du soir.");
    }
    if (data.coranEnabled && minutesDiff(nowHHmm, data.coranTime || "20:00") <= WINDOW_MINUTES) {
      await trySend("coran", "Lecture du Coran", "N'oublie pas ta lecture du Coran aujourd'hui.");
    }
    if (data.fajrEnabled && typeof data.lat === "number" && typeof data.lon === "number") {
      const coordinates = new Coordinates(data.lat, data.lon);
      const params = CalculationMethod.MuslimWorldLeague();
      const prayerTimes = new PrayerTimes(coordinates, new Date(), params);
      const diffMs = Math.abs(Date.now() - prayerTimes.fajr.getTime());
      if (diffMs <= WINDOW_MINUTES * 60000) {
        await trySend("fajr", "Fajr", "L'heure de la prière de Fajr approche.");
      }
    }

    if (Object.keys(updates).length) {
      await docSnap.ref.set({ lastSent: { ...lastSent, ...updates } }, { merge: true });
    }
  }

  return NextResponse.json({ ok: true, sent });
}
