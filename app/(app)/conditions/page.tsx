import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Conditions Générales d'Utilisation — Mon Chemin vers Allah" };

export default function ConditionsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Conditions Générales d'Utilisation et de Vente</h1>
        <p className="mt-1 text-sm text-sand-400">Dernière mise à jour : à compléter</p>
      </div>

      <Card>
        <CardContent className="prose-sm space-y-5 p-6 text-sm leading-relaxed text-beige-100/90">
          <section>
            <h2 className="font-display text-base text-beige-50">1. Objet</h2>
            <p>
              "Mon Chemin vers Allah" est une application d'accompagnement personnel pour
              l'apprentissage progressif de la religion musulmane, la construction de bonnes
              habitudes et le suivi de sa progression spirituelle. En utilisant ce site, tu
              acceptes les présentes conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">2. Contenu religieux — avertissement important</h2>
            <p>
              Les cours, résumés et quiz proposés sont un point de départ pédagogique et de
              vulgarisation, rédigés avec soin mais <strong>sans validation par un savant
              qualifié</strong>. Ils ne remplacent pas l'enseignement d'un enseignant religieux
              compétent et ne constituent pas une fatwa. Pour toute question de jurisprudence
              (fiqh) engageant ta pratique, réfère-toi à des sources savantes reconnues.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">3. Création de compte</h2>
            <p>
              Un compte est nécessaire pour sauvegarder ta progression sur plusieurs appareils et
              pour souscrire à l'abonnement. Tu es responsable de la confidentialité de ton mot de
              passe et de toute activité effectuée depuis ton compte.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">4. Abonnement et paiement</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>L'abonnement (mensuel ou annuel) donne accès à l'ensemble des livres PDF et des quiz.</li>
              <li>Les prix affichés sont indiqués en FCFA [ou devise à préciser] et peuvent évoluer ; tout changement de prix ne s'applique pas aux périodes déjà payées.</li>
              <li>Le paiement est traité par Stripe et/ou PayPal ; nous ne stockons jamais tes coordonnées bancaires.</li>
              <li>L'abonnement se renouvelle automatiquement à chaque période, sauf résiliation avant la date de renouvellement, directement depuis Stripe/PayPal ou en nous contactant.</li>
              <li><strong>Politique de remboursement</strong> : [à définir — ex. remboursement possible sous X jours si le service n'a pas été utilisé, ou politique de non-remboursement passé un délai de rétractation légal].</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">5. Propriété intellectuelle</h2>
            <p>
              Les textes originaux, résumés, quiz, le design et le code de l'application sont la
              propriété de l'éditeur du site. Les textes religieux classiques cités (Coran,
              hadiths, ouvrages du patrimoine islamique) appartiennent au patrimoine commun et ne
              sont pas revendiqués comme propriété exclusive.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">6. Utilisation acceptable</h2>
            <p>
              Tu t'engages à ne pas copier, redistribuer ou revendre le contenu payant du site
              (PDF, quiz) sans autorisation, ni à tenter de contourner les mesures de protection
              du contenu réservé aux abonnés.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">7. Limitation de responsabilité</h2>
            <p>
              Le service est fourni "en l'état". Nous nous efforçons d'assurer la disponibilité et
              l'exactitude du contenu, sans garantie absolue. Nous ne pourrons être tenus
              responsables des interruptions de service, pertes de données ou décisions religieuses
              prises sur la seule base du contenu de l'application.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">8. Résiliation</h2>
            <p>
              Tu peux supprimer ton compte à tout moment. Nous pouvons suspendre ou résilier un
              compte en cas d'usage abusif des présentes conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">9. Droit applicable</h2>
            <p>[À compléter — ex. droit sénégalais / droit français], juridiction compétente en cas de litige : [à préciser].</p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">10. Contact</h2>
            <p>Pour toute question : [email de contact à compléter].</p>
          </section>

          <p className="border-t border-white/10 pt-4 text-xs text-sand-500">
            Ce document est un modèle de départ, pas un avis juridique. Fais-le relire par un
            professionnel du droit avant un lancement commercial, en particulier les clauses de
            remboursement, de résiliation et de droit applicable, qui varient selon ton pays et
            celui de tes utilisateurs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
