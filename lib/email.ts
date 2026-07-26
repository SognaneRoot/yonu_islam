import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendInstance) resendInstance = new Resend(key);
  return resendInstance;
}

/** Envoie un email transactionnel. Ne fait rien (silencieusement) si RESEND_API_KEY
 * n'est pas configurée — n'empêche jamais le paiement/l'inscription de fonctionner. */
export async function sendConfirmationEmail(to: string, subject: string, html: string) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from || !to) return;
  try {
    await resend.emails.send({ from, to, subject, html });
  } catch {
    // échec d'envoi non bloquant — l'abonnement/le compte reste valide même sans email
  }
}

export function subscriptionConfirmationEmail(plan: string) {
  const planLabel = plan === "annual" ? "annuel" : "mensuel";
  return {
    subject: "Ton abonnement Mon Chemin vers Allah est actif ✨",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; color: #1a1a1a;">
        <h2 style="color: #0F3D2E;">Abonnement activé</h2>
        <p>As-salamu alaykum,</p>
        <p>Ton abonnement <strong>${planLabel}</strong> à « Mon Chemin vers Allah » est maintenant actif.
        Tu as accès à l'ensemble des livres et des quiz.</p>
        <p>Qu'Allah bénisse ton cheminement.</p>
        <p style="color: #8C7F6E; font-size: 12px; margin-top: 24px;">
          Cet email confirme ton paiement. Pour toute question, contacte-nous en répondant à cet email.
        </p>
      </div>
    `,
  };
}
