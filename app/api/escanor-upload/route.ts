export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

const MAX_SIZE = 4 * 1024 * 1024; // 4 Mo — limite de taille de requête des fonctions Vercel

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const auth = getAdminAuth();
    if (!auth || !idToken) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const decoded = await auth.verifyIdToken(idToken).catch(() => null);
    if (!decoded || decoded.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Accès réservé à l'administrateur." }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bookId = formData.get("bookId") as string | null;

    if (!file || !bookId) {
      return NextResponse.json({ error: "Fichier ou identifiant manquant." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). L'envoi direct est limité à 4 Mo à cause d'un bug actuel de Vercel Blob — pour un fichier plus gros, dépose-le dans private-books/ via Git (voir README).`,
        },
        { status: 413 }
      );
    }

    const blob = await put(`books/${bookId}.pdf`, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const db = getAdminDb();
    if (db) {
      await db.collection("book_files").doc(bookId).set({
        blobUrl: blob.url,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Échec de l'envoi." }, { status: 500 });
  }
}
