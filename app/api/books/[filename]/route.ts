export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getVerifiedUid } from "@/lib/verify-request";
import { getAdminDb } from "@/lib/firebase/admin";
import { DEFAULT_LIBRARY } from "@/lib/data/library";
import { isBookCategoryAlwaysFree } from "@/lib/daily-quiz";

const ENFORCED = process.env.NEXT_PUBLIC_PREMIUM_ENFORCEMENT === "true";

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  const filename = params.filename;

  // Empêche toute tentative de sortir du dossier (../../etc)
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Nom de fichier invalide." }, { status: 400 });
  }

  let book = DEFAULT_LIBRARY.find((b) => b.file === filename);
  let category = book?.category;

  if (!book) {
    const db = getAdminDb();
    if (db) {
      const snap = await db.collection("library_catalog").where("file", "==", filename).limit(1).get();
      if (!snap.empty) {
        category = snap.docs[0].data().category;
      }
    }
  }

  if (!category) {
    return NextResponse.json({ error: "Livre introuvable." }, { status: 404 });
  }

  const alwaysFree = isBookCategoryAlwaysFree(category);

  if (!alwaysFree && ENFORCED) {
    const uid = await getVerifiedUid(req);
    if (!uid) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
    }
    const subSnap = await db.collection("subscriptions").doc(uid).get();
    const sub = subSnap.data();
    const active =
      sub?.status === "active" && (!sub.expiresAt || new Date(sub.expiresAt).getTime() > Date.now());
    if (!active) {
      return NextResponse.json({ error: "Abonnement requis pour lire ce livre." }, { status: 403 });
    }
  }

  try {
    const filePath = path.join(process.cwd(), "private-books", filename);
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: `Fichier introuvable sur le serveur : private-books/${filename}` },
      { status: 404 }
    );
  }
}
