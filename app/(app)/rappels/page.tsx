"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useReminderPrefs } from "@/lib/reminders";
import { isPushSupported, subscribeToPush } from "@/lib/push";
import { BellRing, MapPin, Moon, Sunrise, Sunset } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RappelsPage() {
  const { user, firebaseReady, loading: authLoading } = useAuth();
  const { prefs, loading, savePrefs } = useReminderPrefs();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!firebaseReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comptes non configurés</CardTitle>
          <CardDescription>Configure Firebase pour activer les rappels — voir le README.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (authLoading || loading) return null;

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connecte-toi pour activer les rappels</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/compte">
            <Button>Se connecter</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  async function ensureSubscribed() {
    if (!isPushSupported()) {
      throw new Error("Les notifications ne sont pas prises en charge sur cet appareil/navigateur.");
    }
    const sub = await subscribeToPush();
    if (!sub) throw new Error("Permission de notification refusée.");
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await savePrefs({ subscription: sub.toJSON(), timezone });
    return sub;
  }

  async function toggleFajr() {
    setError(null);
    setBusy("fajr");
    try {
      if (!prefs.fajrEnabled) {
        await ensureSubscribed();
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
        );
        await savePrefs({
          fajrEnabled: true,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      } else {
        await savePrefs({ fajrEnabled: false });
      }
    } catch (err: any) {
      setError(err?.message || "Impossible d'activer ce rappel.");
    } finally {
      setBusy(null);
    }
  }

  async function toggleFixed(key: "adhkarMatinEnabled" | "adhkarSoirEnabled" | "coranEnabled") {
    setError(null);
    setBusy(key);
    try {
      if (!prefs[key]) {
        await ensureSubscribed();
      }
      await savePrefs({ [key]: !prefs[key] } as any);
    } catch (err: any) {
      setError(err?.message || "Impossible d'activer ce rappel.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Rappels</h1>
        <p className="mt-1 text-sm text-sand-400">
          Reçois une notification même quand le site est fermé.
        </p>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-gold-400" />
            <div>
              <p className="text-beige-50">Rappel Fajr</p>
              <p className="text-xs text-sand-400">Calculé selon ta position (géolocalisation)</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={prefs.fajrEnabled ? "outline" : "primary"}
            disabled={busy === "fajr"}
            onClick={toggleFajr}
          >
            {prefs.fajrEnabled ? "Désactiver" : "Activer"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <Sunrise size={18} className="text-gold-400" />
            <div>
              <p className="text-beige-50">Adhkar du matin</p>
              <input
                type="time"
                value={prefs.adhkarMatinTime}
                onChange={(e) => savePrefs({ adhkarMatinTime: e.target.value })}
                className="mt-1 rounded-lg border border-white/10 bg-night-700/50 px-2 py-1 text-xs text-beige-100"
              />
            </div>
          </div>
          <Button
            size="sm"
            variant={prefs.adhkarMatinEnabled ? "outline" : "primary"}
            disabled={busy === "adhkarMatinEnabled"}
            onClick={() => toggleFixed("adhkarMatinEnabled")}
          >
            {prefs.adhkarMatinEnabled ? "Désactiver" : "Activer"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <Sunset size={18} className="text-gold-400" />
            <div>
              <p className="text-beige-50">Adhkar du soir</p>
              <input
                type="time"
                value={prefs.adhkarSoirTime}
                onChange={(e) => savePrefs({ adhkarSoirTime: e.target.value })}
                className="mt-1 rounded-lg border border-white/10 bg-night-700/50 px-2 py-1 text-xs text-beige-100"
              />
            </div>
          </div>
          <Button
            size="sm"
            variant={prefs.adhkarSoirEnabled ? "outline" : "primary"}
            disabled={busy === "adhkarSoirEnabled"}
            onClick={() => toggleFixed("adhkarSoirEnabled")}
          >
            {prefs.adhkarSoirEnabled ? "Désactiver" : "Activer"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-gold-400" />
            <div>
              <p className="text-beige-50">Lecture du Coran</p>
              <input
                type="time"
                value={prefs.coranTime}
                onChange={(e) => savePrefs({ coranTime: e.target.value })}
                className="mt-1 rounded-lg border border-white/10 bg-night-700/50 px-2 py-1 text-xs text-beige-100"
              />
            </div>
          </div>
          <Button
            size="sm"
            variant={prefs.coranEnabled ? "outline" : "primary"}
            disabled={busy === "coranEnabled"}
            onClick={() => toggleFixed("coranEnabled")}
          >
            {prefs.coranEnabled ? "Désactiver" : "Activer"}
          </Button>
        </CardContent>
      </Card>

      <p className="flex items-center gap-1.5 text-xs text-sand-500">
        <BellRing size={13} /> La première activation te demandera la permission d'envoyer des
        notifications.
      </p>
    </div>
  );
}
