import { NextRequest } from "next/server";
import { getAdminAuth } from "./firebase/admin";

/** Vérifie le jeton d'identité Firebase envoyé dans l'en-tête Authorization et renvoie
 * l'uid réel de l'utilisateur connecté — jamais un uid fourni tel quel par le client. */
export async function getVerifiedUid(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const auth = getAdminAuth();
  if (!auth) return null;

  try {
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}
