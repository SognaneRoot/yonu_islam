export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getVerifiedUser } from "@/lib/verify-request";
import { getAdminDb } from "@/lib/firebase/admin";
import { DEFAULT_LIBRARY } from "@/lib/data/library";
import { isBookCategoryAlwaysFree } from "@/lib/daily-quiz";

const ENFORCED = process.env.NEXT_PUBLIC_PREMIUM_ENFORCEMENT === "true";

export async function GET(req: NextRequest, { params }: { params: { bookId: string } }) {
  const bookId = params.bookId;

  if (!bookId || bookId.includes("..") || bookId.includes("/")) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  // 1. Déterminer la catégorie (livre de base codé en dur, ou ajouté via le panneau admin)
  const builtIn = DEFAULT_LIBRARY.find((b) => b.id === bookId);
  let category = builtIn?.category;
  let legacyFile = builtIn?.file;

  const db = getAdminDb();

  if (!category && db) {
    const catalogSnap = await db.collection("library_catalog").doc(bookId).get();
    if (catalogSnap.exists) {
      category = catalogSnap.data()?.category;
    }
  }

  if (!category) {
    return NextResponse.json({ error: "Livre introuvable." }, { status: 404 });
  }

  const alwaysFree = isBookCategoryAlwaysFree(category);

  // 2. Vérifier l'accès (abonnement) si nécessaire
  if (!alwaysFree && ENFORCED) {
      const authUser = await getVerifiedUser(req);
      if (!authUser) {
        return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
      }
      const isAdmin = authUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (!isAdmin) {
        if (!db) {
          return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
        }
        const subSnap = await db.collection("subscriptions").doc(authUser.uid).get();
        const sub = subSnap.data();
        const active =
          sub?.status === "active" && (!sub.expiresAt || new Date(sub.expiresAt).getTime() > Date.now());
        if (!active) {
          return NextResponse.json({ error: "Abonnement requis pour lire ce livre." }, { status: 403 });
        }
      }
    }

  // 3. Récupérer le fichier — priorité à Vercel Blob (envoyé depuis /escanor). L'URL réelle
  // n'est jamais transmise au navigateur : on la récupère côté serveur et on relaie les octets.
  try {
    if (db) {
      const fileDoc = await db.collection("book_files").doc(bookId).get();
      const blobUrl = fileDoc.data()?.blobUrl;
      if (blobUrl) {
        const blobRes = await fetch(blobUrl);
        if (blobRes.ok) {
          const arrayBuffer = await blobRes.arrayBuffer();
          return new NextResponse(new Uint8Array(arrayBuffer), {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": "inline",
              "Cache-Control": "private, no-store",
            },
          });
        }
      }
    }

    if (legacyFile) {
      const filePath = path.join(process.cwd(), "private-books", legacyFile);
      const buffer = await readFile(filePath);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline",
          "Cache-Control": "private, no-store",
        },
      });
    }

    return NextResponse.json({ error: "Aucun PDF n'a encore été envoyé pour ce livre." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }
}
