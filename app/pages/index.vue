<script lang='ts' setup>
import { GITHUB_PROFILE, INSTAGRAM_PROFILE, LINKEDIN_PROFILE, SITE_URL } from '#shared/consts/urls'
import { Socials } from '#shared/consts/socials'

useSeoMeta({
  title: 'Software Enginereer | Vitaly Lysen',
  description: 'Welcome to my personal website where I share my projects, blog posts, and photography.',
  ogTitle: 'Vitaly Lysen - Software Engineer',
  ogDescription: 'Welcome to my personal website where I share my projects, blog posts, and photography.',
  ogUrl: SITE_URL,
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
  ogType: 'website',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      value: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Vitaly',
        'url': SITE_URL,
        'jobTitle': 'Software Engineer',
        'sameAs': [
          GITHUB_PROFILE,
          LINKEDIN_PROFILE,
          INSTAGRAM_PROFILE,
        ],
        'description': 'Software engineer and engineering and computer graphics student in France.',
      }),
    },
  ],
})
</script>

<template>
  <div class="px-4 mx-auto max-w-prose space-y-4 slide-enter-content">
    <h1 class="text-2xl font-semibold mb-8 mt-24 before:content-['>'] before:inline-block before:h-1 before:mb-4">
      lysen.dev
    </h1>
    <p>
      Hi, I'm <strong>Vitaly</strong>, a software engineer passionate about building web applications, graphics and
      exploring new technologies.
    </p>

    <p>
      I am currently in my last year of engineering studies in France.
      I'm also following a master's degree in computer graphics.
    </p>

    <p>
      I love technology, music, fashion, wood-working and photography. You can view a selection of my photography work
      in <a
        class="underline-link"
        href="https://photography.lysen.dev"
      >the gallery</a>. I try to post new photos there every now and then.
    </p>

    <p>
      This is my personal website where I share my <a
        class="underline-link"
        href="/projects"
      >
        projects
      </a>, occasional <a
        class="underline-link"
        href="/lab"
      >
        experiments
      </a>, <a
        class="underline-link"
        href="/blog"
      >blog posts</a>, and thoughts on software development.
    </p>

    <p>
      Slowly but surely, I'm trying to contribute more and more to the open-source community. You can check out my
      <a
        class="underline-link"
        href="https://github.com/Neikow"
      >GitHub profile</a> to see what I've been working on.
    </p>

    <p>
      Let's stay connected! You can find me on
    </p>

    <div class="flex gap-4 justify-center">
      <UButton
        v-for="link in Socials"
        :key="link.label"
        :icon="link.icon"
        :title="link.title"
        :to="link.href"
        rel="me"
        variant="link"
      >
        {{ link.label }}
      </UButton>
    </div>

    <p>
      Or just email me at vitaly
      <UIcon
        class="translate-y-1 -mx-1"
        name="i-material-symbols:alternate-email"
      />
      lysen.dev
    </p>
  </div>
</template>
