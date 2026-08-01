export const runtime = "nodejs";

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const idToken = clientPayload;
        const auth = getAdminAuth();
        if (!auth || !idToken) {
          throw new Error("Non authentifié.");
        }
        const decoded = await auth.verifyIdToken(idToken).catch(() => null);
        if (!decoded || decoded.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          throw new Error("Accès réservé à l'administrateur.");
        }
        return {
          allowedContentTypes: ["application/pdf"],
          addRandomSuffix: false,
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 Mo
        };
      },
      onUploadCompleted: async ({ blob }) => {
        const db = getAdminDb();
        if (!db) return;
        const match = blob.pathname.match(/^books\/(.+)\.pdf$/);
        const bookId = match?.[1];
        if (bookId) {
          await db.collection("book_files").doc(bookId).set({
            blobUrl: blob.url,
            updatedAt: new Date().toISOString(),
          });
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Échec de l'envoi." }, { status: 400 });
  }
}
