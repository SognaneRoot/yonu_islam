import { createBrowserClient } from "@supabase/ssr";

/**
 * Renvoie un client Supabase si les variables d'environnement sont définies,
 * sinon `null`. L'application fonctionne entièrement en local (localStorage)
 * sans Supabase configuré — voir README.md pour activer la synchronisation cloud.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
