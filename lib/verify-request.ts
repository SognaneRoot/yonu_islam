import { NextRequest } from "next/server";
import { getAdminAuth } from "./firebase/admin";

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

/** Comme getVerifiedUid, mais renvoie aussi l'email — utile pour vérifier l'admin côté serveur. */
export async function getVerifiedUser(req: NextRequest): Promise<{ uid: string; email: string | null } | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  const auth = getAdminAuth();
  if (!auth) return null;
  try {
    const decoded = await auth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email || null };
  } catch {
    return null;
  }
}