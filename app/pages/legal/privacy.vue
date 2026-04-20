<script lang="ts" setup>
import { SITE_URL } from '#shared/consts/urls'

const route = useRoute()
const lang = computed(() => route.query.lang === 'fr' ? 'fr' : 'en')

function toggleLang() {
  navigateTo({ query: { lang: lang.value === 'fr' ? 'en' : 'fr' } })
}

useSeoMeta({
  title: 'Privacy Policy | Politique de Confidentialité',
  description: 'Privacy policy and personal data processing information for lysen.dev.',
  ogUrl: `${SITE_URL}/legal/privacy`,
})

useHead(computed(() => ({ htmlAttrs: { lang: lang.value } })))
</script>

<template>
  <main class="px-4 mx-auto max-w-prose py-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold">
        <span v-if="lang === 'fr'">Politique de Confidentialité</span>
        <span v-else>Privacy Policy</span>
      </h1>
      <UButton variant="ghost" size="sm" @click="toggleLang">
        {{ lang === 'fr' ? 'English' : 'Français' }}
      </UButton>
    </div>

    <!-- FRENCH -->
    <template v-if="lang === 'fr'">
      <section class="space-y-6 text-sm leading-relaxed">
        <p class="text-muted">
          Dernière mise à jour : 19 avril 2026
        </p>

        <div>
          <h2 class="font-semibold text-base mb-2">1. Responsable du traitement</h2>
          <p>
            <strong>Vitaly Lysen</strong> — vitaly@lysen.dev<br>
            France
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">2. Données collectées et finalités</h2>

          <h3 class="font-medium mt-3 mb-1">a) Analytique (Umami)</h3>
          <p>
            Ce site utilise <strong>Umami Analytics</strong>, une solution auto-hébergée sur <code>analytics.lysen.dev</code>.
            Umami ne dépose <strong>aucun cookie</strong> et ne suit pas les utilisateurs entre les sessions.
            Les données collectées sont : URL de la page consultée, référent, résolution d'écran, navigateur, système d'exploitation, pays estimé (via IP anonymisée).
            L'adresse IP est hachée et non conservée en clair.
          </p>
          <ul class="mt-1 space-y-1 list-disc pl-5">
            <li><strong>Finalité :</strong> mesure d'audience anonymisée</li>
            <li><strong>Base légale :</strong> intérêt légitime (RGPD Art. 6.1.f) — absence de cookies de suivi</li>
            <li><strong>Durée de conservation :</strong> 12 mois glissants</li>
          </ul>

          <h3 class="font-medium mt-3 mb-1">b) Surveillance des erreurs (Sentry)</h3>
          <p>
            Ce site utilise <strong>Sentry</strong> pour la surveillance des erreurs techniques.
            Sentry peut collecter : messages d'erreur, traces d'appel, informations sur le navigateur, système d'exploitation, et potentiellement l'adresse IP.
            La transmission de données personnelles identifiables (<code>sendDefaultPii</code>) est désactivée.
          </p>
          <ul class="mt-1 space-y-1 list-disc pl-5">
            <li><strong>Finalité :</strong> débogage et stabilité du site</li>
            <li><strong>Base légale :</strong> intérêt légitime (RGPD Art. 6.1.f)</li>
            <li><strong>Sous-traitant :</strong> Sentry (Functional Software, Inc.) — <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" class="underline">politique de confidentialité</a></li>
            <li><strong>Durée de conservation :</strong> 90 jours</li>
          </ul>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">3. Cookies</h2>
          <p>
            Ce site n'utilise <strong>aucun cookie de traçage ou publicitaire</strong>.
            Umami Analytics ne dépose aucun cookie.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">4. Partage des données</h2>
          <p>
            Aucune donnée personnelle n'est vendue, louée ou cédée à des tiers à des fins commerciales.
            Les données peuvent être transmises aux sous-traitants techniques listés ci-dessus (Sentry) dans le strict cadre de leurs missions.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">5. Transferts hors Union Européenne</h2>
          <p>
            Sentry (Functional Software, Inc.) est une société américaine. Le transfert de données vers les États-Unis est encadré par les
            <strong>Clauses Contractuelles Types (CCT)</strong> de la Commission européenne conformément à l'article 46.2.c du RGPD.
            Pour plus d'informations, consultez la <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" class="underline">politique de confidentialité de Sentry</a>.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">6. Vos droits (RGPD)</h2>
          <p>Conformément au RGPD (Règlement UE 2016/679), vous disposez des droits suivants :</p>
          <ul class="mt-2 space-y-1 list-disc pl-5">
            <li><strong>Droit d'accès</strong> — obtenir une copie des données vous concernant</li>
            <li><strong>Droit de rectification</strong> — corriger des données inexactes</li>
            <li><strong>Droit à l'effacement</strong> — demander la suppression de vos données</li>
            <li><strong>Droit à la limitation du traitement</strong></li>
            <li><strong>Droit d'opposition</strong> — vous opposer au traitement fondé sur l'intérêt légitime</li>
            <li><strong>Droit à la portabilité</strong></li>
          </ul>
          <p class="mt-2">
            Pour exercer vos droits, contactez : <strong>vitaly@lysen.dev</strong><br>
            Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" class="underline">CNIL</a>.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">7. Sécurité</h2>
          <p>
            Des mesures techniques et organisationnelles appropriées sont mises en œuvre pour protéger vos données contre tout accès non autorisé, perte ou altération.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">8. Modifications</h2>
          <p>
            Cette politique peut être mise à jour. La date de dernière modification est indiquée en haut de cette page.
          </p>
        </div>
      </section>
    </template>

    <!-- ENGLISH -->
    <template v-else>
      <section class="space-y-6 text-sm leading-relaxed">
        <p class="text-muted">
          Last updated: 19 April 2026
        </p>

        <div>
          <h2 class="font-semibold text-base mb-2">1. Data Controller</h2>
          <p>
            <strong>Vitaly Lysen</strong> — vitaly@lysen.dev<br>
            France
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">2. Data Collected and Purposes</h2>

          <h3 class="font-medium mt-3 mb-1">a) Analytics (Umami)</h3>
          <p>
            This site uses <strong>Umami Analytics</strong>, a self-hosted solution on <code>analytics.lysen.dev</code>.
            Umami sets <strong>no cookies</strong> and does not track users across sessions.
            Data collected: page URL, referrer, screen resolution, browser, OS, estimated country (via anonymised IP).
            IP addresses are hashed and never stored in plain text.
          </p>
          <ul class="mt-1 space-y-1 list-disc pl-5">
            <li><strong>Purpose:</strong> anonymous audience measurement</li>
            <li><strong>Legal basis:</strong> legitimate interest (GDPR Art. 6.1.f) — no tracking cookies</li>
            <li><strong>Retention:</strong> 12 months rolling</li>
          </ul>

          <h3 class="font-medium mt-3 mb-1">b) Error Monitoring (Sentry)</h3>
          <p>
            This site uses <strong>Sentry</strong> for technical error monitoring.
            Sentry may collect: error messages, stack traces, browser and OS information, and potentially IP addresses.
            Transmission of personally identifiable data (<code>sendDefaultPii</code>) is disabled.
          </p>
          <ul class="mt-1 space-y-1 list-disc pl-5">
            <li><strong>Purpose:</strong> debugging and site stability</li>
            <li><strong>Legal basis:</strong> legitimate interest (GDPR Art. 6.1.f)</li>
            <li><strong>Processor:</strong> Sentry (Functional Software, Inc.) — <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" class="underline">privacy policy</a></li>
            <li><strong>Retention:</strong> 90 days</li>
          </ul>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">3. Cookies</h2>
          <p>
            This site uses <strong>no tracking or advertising cookies</strong>.
            Umami Analytics sets no cookies.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">4. Data Sharing</h2>
          <p>
            No personal data is sold, rented or transferred to third parties for commercial purposes.
            Data may be transmitted to the technical processors listed above (Sentry) strictly within the scope of their services.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">5. International Data Transfers</h2>
          <p>
            Sentry (Functional Software, Inc.) is a US-based company. Transfers of data to the United States are governed by
            <strong>Standard Contractual Clauses (SCCs)</strong> adopted by the European Commission pursuant to GDPR Article 46.2(c).
            For more information, see <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" class="underline">Sentry's privacy policy</a>.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">6. Your Rights (GDPR)</h2>
          <p>Under GDPR (Regulation EU 2016/679), you have the following rights:</p>
          <ul class="mt-2 space-y-1 list-disc pl-5">
            <li><strong>Right of access</strong> — obtain a copy of data held about you</li>
            <li><strong>Right of rectification</strong> — correct inaccurate data</li>
            <li><strong>Right to erasure</strong> — request deletion of your data</li>
            <li><strong>Right to restriction of processing</strong></li>
            <li><strong>Right to object</strong> — object to processing based on legitimate interest</li>
            <li><strong>Right to data portability</strong></li>
          </ul>
          <p class="mt-2">
            To exercise your rights, contact: <strong>vitaly@lysen.dev</strong><br>
            You may also file a complaint with the <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" class="underline">CNIL (French data protection authority)</a>.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">7. Security</h2>
          <p>
            Appropriate technical and organisational measures are implemented to protect your data against unauthorised access, loss or alteration.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">8. Changes</h2>
          <p>
            This policy may be updated. The last modification date is shown at the top of this page.
          </p>
        </div>
      </section>
    </template>
  </main>
</template>
