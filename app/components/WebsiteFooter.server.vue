<template>
  <footer
    class="border-t border-t-default bg-default"
    role="contentinfo"
  >
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <nav aria-label="Footer Navigation">
          <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <li>
              <NuxtLink
                class="hover:text-primary transition-colors"
                to="/"
              >Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:text-primary transition-colors"
                to="https://photography.lysen.dev"
              >Photography
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:text-primary transition-colors"
                to="/projects"
              >Projects
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:text-primary transition-colors"
                to="/blog"
              >Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="hover:text-primary transition-colors"
                to="/lab"
              >Lab
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="flex gap-1 justify-center">
          <UButton
            v-for="link in Socials"
            :key="link.label"
            :icon="link.icon"
            :title="link.title"
            :to="link.href"
            rel="me"
            variant="link"
          >
            <span class="sr-only">{{ link.label }}</span>
          </UButton>
        </div>
      </div>

      <div class="mt-8 pt-4 border-t border-default text-center">
        <p class="text-sm text-muted-foreground">
          &copy; {{ currentYear }} <strong>Vitaly Lysen</strong>.
          All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { Socials } from '#shared/consts/socials'

const currentYear = new Date().getFullYear()
</script>
