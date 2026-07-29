import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      // reCAPTCHA pas configuré côté serveur : ne bloque pas l'inscription, juste ignoré.
      return NextResponse.json({ success: true, skipped: true });
    }
    if (!token) {
      return NextResponse.json({ success: false, error: "Jeton reCAPTCHA manquant." }, { status: 400 });
    }

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const json = await res.json();

    return NextResponse.json({ success: !!json.success });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur de vérification." }, { status: 500 });
  }
}
