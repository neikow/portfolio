<script lang='ts' setup>
const connectLinks: {
  name: string
  href: string
  icon: string
}[] = [
  { name: 'GitHub', href: 'https://github.com/Neikow', icon: 'i-mdi-github' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/vitaly-lysen/', icon: 'i-mdi-linkedin' },
  { name: 'Instagram', href: 'https://www.instagram.com/vitaly.lyn/', icon: 'i-mdi-instagram' },
]

useSeoMeta({
  title: 'Home',
  description: 'Welcome to my personal website where I share my projects, blog posts, and photography.',
  ogTitle: 'Home - lysen.dev',
  ogDescription: 'Welcome to my personal website where I share my projects, blog posts, and photography.',
  ogUrl: 'https://lysen.dev',
  ogSiteName: 'lysen.dev',
  ogLocale: 'en_US',
  ogType: 'website',
})
</script>

<template>
  <div class="px-4 mx-auto max-w-prose space-y-4 slide-enter-content">
    <h1 class="text-2xl font-semibold mb-8 mt-24">
      > lysen.dev
    </h1>
    <p>
      Hi, I'm Vitaly, a software developer passionate about building web applications and exploring new
      technologies.
    </p>

    <p>I am currently in my last year of engineering studies in France.</p>

    <p>
      I love technology, music, fashion, wood-working and photography. You can view a selection of my photography work
      in <a
        class="underline-link"
        href="/photography"
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
      <a
        v-for="link in connectLinks"
        :key="link.name"
        :href="link.href"
        class="underline-link"
      >
        <UIcon
          :name="link.icon"
          class="mr-1 translate-y-0.5"
        />
        <span>
          {{ link.name }}
        </span>
      </a>
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
