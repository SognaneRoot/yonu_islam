import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Politique de confidentialité — Mon Chemin vers Allah" };

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Politique de confidentialité</h1>
        <p className="mt-1 text-sm text-sand-400">Dernière mise à jour : à compléter</p>
      </div>

      <Card>
        <CardContent className="prose-sm space-y-5 p-6 text-sm leading-relaxed text-beige-100/90">
          <p>
            Cette page explique quelles données « Mon Chemin vers Allah » collecte, pourquoi, et
            comment tu peux garder le contrôle dessus.
          </p>

          <section>
            <h2 className="font-display text-base text-beige-50">1. Qui sommes-nous</h2>
            <p>
              [À compléter : nom de l'éditeur du site, pays, contact — ex. nom/entreprise, ville,
              email de contact]. C'est cette entité qui est responsable du traitement de tes
              données au sens de la réglementation applicable.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">2. Données que nous collectons</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Compte</strong> : email et mot de passe (géré par Firebase Authentication, jamais stocké en clair par nous).</li>
              <li><strong>Progression</strong> : niveau, XP, habitudes cochées, adhkar mémorisées, notes personnelles, pages de lecture, entrées de ton journal "Mon Combat".</li>
              <li><strong>Abonnement</strong> : statut (actif/expiré), plan choisi, référence de paiement — les données de carte bancaire elles-mêmes ne transitent jamais par nos serveurs : elles sont traitées directement par Stripe ou PayPal.</li>
              <li><strong>Technique</strong> : aucune publicité, aucun traceur publicitaire tiers. Firebase peut enregistrer des données techniques minimales nécessaires au fonctionnement (authentification, requêtes à la base de données).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">3. Le contenu de "Mon Combat"</h2>
            <p>
              Le journal "Mon Combat" peut contenir des informations sensibles et personnelles liées
              à ta pratique religieuse. Ces données sont stockées comme le reste de ta progression,
              liées uniquement à ton compte, jamais partagées, jamais utilisées à des fins
              commerciales, et jamais visibles par qui que ce soit d'autre que toi.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">4. Sous-traitants (hébergement des données)</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Google Firebase</strong> (authentification et base de données Firestore)</li>
              <li><strong>Vercel</strong> (hébergement du site)</li>
              <li><strong>Stripe</strong> et/ou <strong>PayPal</strong> (traitement des paiements, uniquement si tu t'abonnes)</li>
            </ul>
            <p>
              Chacun de ces prestataires a sa propre politique de confidentialité et peut héberger
              des données en dehors de ton pays de résidence.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">5. Durée de conservation</h2>
            <p>
              Tes données sont conservées tant que ton compte existe. Tu peux demander leur
              suppression à tout moment (voir section 7).
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">6. Utilisateurs mineurs</h2>
            <p>
              Ce service n'est pas spécifiquement destiné aux enfants. Si tu as moins de 15 ans,
              merci de ne créer un compte qu'avec l'accord d'un parent ou tuteur.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">7. Tes droits</h2>
            <p>
              Tu peux à tout moment demander l'accès, la correction ou la suppression de tes
              données, en nous contactant à [email de contact à compléter]. Tu peux aussi
              simplement supprimer ton compte depuis la page "Mon compte" [fonctionnalité à activer
              si tu la souhaites].
            </p>
          </section>

          <section>
            <h2 className="font-display text-base text-beige-50">8. Modifications</h2>
            <p>
              Cette politique peut évoluer. La date de mise à jour en haut de page indique la
              dernière version en vigueur.
            </p>
          </section>

          <p className="border-t border-white/10 pt-4 text-xs text-sand-500">
            Ce document est un modèle de départ, pas un avis juridique. Avant une mise en
            production sérieuse (surtout avec des paiements), fais-le relire par un professionnel
            du droit compétent dans ta juridiction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
