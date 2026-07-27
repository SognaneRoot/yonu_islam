"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useReminderPrefs, PrayerKey, PRAYER_LABELS } from "@/lib/reminders";
import { isPushSupported, subscribeToPush } from "@/lib/push";
import { BellRing, MapPin, Moon, Sunrise, Sunset } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CITY_PRESETS = [
  { label: "Dakar", lat: 14.6928, lon: -17.4467 },
  { label: "Thiès", lat: 14.791, lon: -16.9256 },
  { label: "Saint-Louis", lat: 16.0326, lon: -16.4818 },
  { label: "Touba", lat: 14.85, lon: -15.8833 },
  { label: "Kaolack", lat: 14.1652, lon: -16.0726 },
  { label: "Ziguinchor", lat: 12.5665, lon: -16.2733 },
];

const PRAYER_ORDER: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function RappelsClient() {
  const { user, firebaseReady, loading: authLoading } = useAuth();
  const { prefs, loading, savePrefs } = useReminderPrefs();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [testBusy, setTestBusy] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

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
    if (!sub) {
      throw new Error(
        "Permission de notification refusée ou bloquée par le navigateur (sur Brave : brave://settings/privacy → active « Use Google services for push messaging »)."
      );
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await savePrefs({ subscription: sub.toJSON(), timezone });
    return sub;
  }

  async function setLocation(lat: number, lon: number, label: string) {
    setError(null);
    setBusy("location");
    try {
      await ensureSubscribed();
      await savePrefs({ lat, lon, locationLabel: label });
    } catch (err: any) {
      setError(err?.message || "Impossible d'enregistrer la position.");
    } finally {
      setBusy(null);
    }
  }

  async function useBrowserLocation() {
    setError(null);
    setBusy("location");
    try {
      await ensureSubscribed();
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      await savePrefs({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        locationLabel: "Position actuelle",
      });
    } catch (err: any) {
      setError(
        "La géolocalisation du navigateur a été refusée. Utilise plutôt une ville ci-dessous, ou saisis tes coordonnées manuellement."
      );
    } finally {
      setBusy(null);
    }
  }

  async function togglePrayer(key: PrayerKey) {
    setError(null);
    const enabling = !prefs.prayers[key];
    if (enabling && prefs.lat == null) {
      setError("Choisis d'abord ta position ci-dessous (ville ou coordonnées) avant d'activer une prière.");
      return;
    }
    setBusy(key);
    try {
      if (enabling) await ensureSubscribed();
      await savePrefs({ prayers: { ...prefs.prayers, [key]: enabling } });
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

  async function sendTestNotification() {
    setTestResult(null);
    setTestBusy(true);
    try {
      const idToken = await user!.getIdToken();
      const res = await fetch("/api/push/test", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const json = await res.json();
      setTestResult(json.ok ? "Notification de test envoyée — regarde ton écran." : json.error);
    } catch {
      setTestResult("Échec de l'envoi du test.");
    } finally {
      setTestBusy(false);
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

      <div>
        <Button size="sm" variant="outline" disabled={testBusy} onClick={sendTestNotification}>
          {testBusy ? "Envoi..." : "Envoyer une notification de test"}
        </Button>
        {testResult && <p className="mt-2 text-xs text-sand-400">{testResult}</p>}
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={16} className="text-gold-400" /> Ta position
          </CardTitle>
          <CardDescription>
            {prefs.locationLabel
              ? `Position actuelle : ${prefs.locationLabel}`
              : "Nécessaire pour calculer les heures de prière"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button size="sm" variant="outline" disabled={busy === "location"} onClick={useBrowserLocation}>
            Utiliser la géolocalisation du navigateur
          </Button>

          <div className="flex flex-wrap gap-1.5">
            {CITY_PRESETS.map((city) => (
              <button
                key={city.label}
                disabled={busy === "location"}
                onClick={() => setLocation(city.lat, city.lon, city.label)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  prefs.locationLabel === city.label
                    ? "border-emerald-500/50 bg-emerald-500/15 text-beige-100"
                    : "border-white/8 text-sand-400 hover:text-beige-100"
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowManual((s) => !s)}
            className="text-xs text-gold-400 hover:underline"
          >
            {showManual ? "Masquer" : "Ma ville n'est pas dans la liste — saisir les coordonnées"}
          </button>

          {showManual && (
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="block text-[11px] text-sand-400">Latitude</label>
                <input
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="14.6928"
                  className="w-28 rounded-lg border border-white/10 bg-night-700/50 px-2 py-1.5 text-sm text-beige-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-sand-400">Longitude</label>
                <input
                  value={manualLon}
                  onChange={(e) => setManualLon(e.target.value)}
                  placeholder="-17.4467"
                  className="w-28 rounded-lg border border-white/10 bg-night-700/50 px-2 py-1.5 text-sm text-beige-100"
                />
              </div>
              <Button
                size="sm"
                disabled={busy === "location"}
                onClick={() => {
                  const lat = parseFloat(manualLat);
                  const lon = parseFloat(manualLon);
                  if (Number.isNaN(lat) || Number.isNaN(lon)) {
                    setError("Coordonnées invalides.");
                    return;
                  }
                  setLocation(lat, lon, "Coordonnées manuelles");
                }}
              >
                Enregistrer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prières</CardTitle>
          <CardDescription>Calculées automatiquement selon ta position</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {PRAYER_ORDER.map((key) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-white/8 px-3.5 py-2.5">
              <span className="text-beige-100">{PRAYER_LABELS[key]}</span>
              <Button
                size="sm"
                variant={prefs.prayers[key] ? "outline" : "primary"}
                disabled={busy === key}
                onClick={() => togglePrayer(key)}
              >
                {prefs.prayers[key] ? "Désactiver" : "Activer"}
              </Button>
            </div>
          ))}
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
