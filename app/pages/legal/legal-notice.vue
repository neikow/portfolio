<script lang="ts" setup>
import { SITE_URL } from '#shared/consts/urls'

const route = useRoute()
const lang = computed(() => route.query.lang === 'fr' ? 'fr' : 'en')

function toggleLang() {
  navigateTo({ query: { lang: lang.value === 'fr' ? 'en' : 'fr' } })
}

useSeoMeta({
  title: 'Legal Notice | Mentions Légales',
  description: 'Legal notice and publisher information for lysen.dev.',
  ogUrl: `${SITE_URL}/legal/legal-notice`,
})

useHead(computed(() => ({ htmlAttrs: { lang: lang.value } })))
</script>

<template>
  <main class="px-4 mx-auto max-w-prose py-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold">
        <span v-if="lang === 'fr'">Mentions Légales</span>
        <span v-else>Legal Notice</span>
      </h1>
      <UButton variant="ghost" size="sm" @click="toggleLang">
        {{ lang === 'fr' ? 'English' : 'Français' }}
      </UButton>
    </div>

    <!-- FRENCH -->
    <template v-if="lang === 'fr'">
      <section class="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 class="font-semibold text-base mb-2">1. Éditeur du site</h2>
          <p>Le présent site <strong>lysen.dev</strong> est édité par :</p>
          <ul class="mt-2 space-y-1 list-none pl-0">
            <li><strong>Nom :</strong> Vitaly Lysen</li>
            <li><strong>Statut :</strong> Personne physique (particulier)</li>
            <li><strong>Email :</strong> vitaly@lysen.dev</li>
            <li><strong>Pays :</strong> France</li>
          </ul>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">2. Hébergeur</h2>
          <p>Le site est hébergé par :</p>
          <ul class="mt-2 space-y-1 list-none pl-0">
            <li><strong>Société :</strong> Contabo GmbH</li>
            <li><strong>Adresse :</strong> Im Riesling 1, 54290 Dahn, Germany</li>
            <li><strong>Téléphone :</strong> +49 6542 939600</li>
            <li><strong>Site web :</strong> https://www.contabo.com</li>
          </ul>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">3. Directeur de la publication</h2>
          <p>Vitaly Lysen — vitaly@lysen.dev</p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">4. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, photographies, code source) est protégé par le droit d'auteur.
            Toute reproduction, représentation, modification ou diffusion, totale ou partielle, sans autorisation écrite préalable de l'éditeur est interdite.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">5. Limitation de responsabilité</h2>
          <p>
            Les informations contenues sur ce site sont fournies à titre indicatif. L'éditeur s'efforce de maintenir ces informations exactes et à jour,
            mais ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des informations diffusées.
            Les liens hypertextes pointant vers d'autres sites ne sauraient engager la responsabilité de l'éditeur.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">6. Loi applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l'utilisation du site sera soumis à la compétence des tribunaux français.
          </p>
          <p class="mt-2">
            Références légales : Loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">7. Contact</h2>
          <p>Pour toute question relative à ces mentions légales : <strong>vitaly@lysen.dev</strong></p>
        </div>
      </section>
    </template>

    <!-- ENGLISH -->
    <template v-else>
      <section class="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 class="font-semibold text-base mb-2">1. Publisher</h2>
          <p>The website <strong>lysen.dev</strong> is published by:</p>
          <ul class="mt-2 space-y-1 list-none pl-0">
            <li><strong>Name:</strong> Vitaly Lysen</li>
            <li><strong>Status:</strong> Individual (natural person)</li>
            <li><strong>Email:</strong> vitaly@lysen.dev</li>
            <li><strong>Country:</strong> France</li>
          </ul>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">2. Hosting Provider</h2>
          <p>This website is hosted by:</p>
          <ul class="mt-2 space-y-1 list-none pl-0">
            <li><strong>Company:</strong> Contabo GmbH</li>
            <li><strong>Address:</strong> Im Riesling 1, 54290 Dahn, Germany</li>
            <li><strong>Phone:</strong> +49 6542 939600</li>
            <li><strong>Website:</strong> https://www.contabo.com</li>
          </ul>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">3. Publication Director</h2>
          <p>Vitaly Lysen — vitaly@lysen.dev</p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">4. Intellectual Property</h2>
          <p>
            All content on this website (text, images, photographs, source code) is protected by copyright.
            Any reproduction, representation, modification or distribution, in whole or in part, without prior written permission from the publisher is prohibited.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">5. Limitation of Liability</h2>
          <p>
            The information on this site is provided for informational purposes only. The publisher makes every effort to keep the information accurate and up-to-date
            but cannot guarantee the accuracy, completeness or timeliness of the information published.
            Hyperlinks to third-party websites do not engage the publisher's liability.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">6. Applicable Law</h2>
          <p>
            These legal notices are governed by French law. Any dispute relating to the use of the site will be subject to the jurisdiction of the French courts.
          </p>
          <p class="mt-2">
            Legal references: French law n°2004-575 of June 21, 2004 on confidence in the digital economy (LCEN).
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-base mb-2">7. Contact</h2>
          <p>For any questions regarding this legal notice: <strong>vitaly@lysen.dev</strong></p>
        </div>
      </section>
    </template>
  </main>
</template>
