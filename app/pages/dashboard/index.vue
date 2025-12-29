<template>
  <div class="flex flex-col my-4 mx-4">
    <h1 class="text-3xl font-bold mt-32">
      {{ randomGreeting }}
    </h1>

    <div
      v-if="status === 'success'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
    >
      <DashboardHomeCard
        :stats="[
          { label: 'Total Experiences', value: stats?.experiencesCount },
          { label: 'Years', value: stats?.experiencesYears.toFixed(1) }]"
        title="Experiences"
      >
        <p class="text-center">
          Let's go on a job hunt!
        </p>

        <template #actions>
          <div class="flex gap-4">
            <UButton
              :icon="Icons.ui.settings"
              class="w-full"
              color="secondary"
              to="/dashboard/experiences"
            >
              Manage
            </UButton>
            <UButton
              :icon="Icons.actions.add"
              class="w-full"
              color="primary"
              to="/dashboard/experiences?new"
            >
              New Experience
            </UButton>
          </div>
        </template>
      </DashboardHomeCard>

      <DashboardHomeCard
        :stats="[
          { label: 'Experiments', value: stats?.labExperimentsCount },
        ]"
        title="Lab"
      >
        <p class="text-center">
          Have you built something cool recently?
        </p>

        <template #actions>
          <div class="flex gap-4">
            <UButton
              :icon="Icons.ui.settings"
              class="w-full"
              color="secondary"
              to="/dashboard/lab"
            >
              Manage
            </UButton>
            <UButton
              :icon="Icons.actions.add"
              class="w-full"
              color="primary"
              to="/dashboard/lab?new"
            >
              New Experiment
            </UButton>
          </div>
        </template>
      </DashboardHomeCard>

      <DashboardHomeCard
        :stats="[
          { label: 'Published', value: stats?.blogPostsCount },
          { label: 'Drafts', value: stats?.blogDraftsCount },
        ]"
        title="Blog"
      >
        <p :class="[getLastBlogPostDateColor(stats?.lastBlogPostDate), 'text-center']">
          Last published
          <strong>{{ stats?.lastBlogPostDate ? dayjs(stats.lastBlogPostDate).fromNow() : 'N/A' }}</strong>.
        </p>

        <template #actions>
          <div class="flex gap-4">
            <UButton
              :icon="Icons.ui.settings"
              class="w-full"
              color="secondary"
              to="/dashboard/blog-posts"
            >
              Manage
            </UButton>
            <UButton
              :icon="Icons.actions.add"
              class="w-full"
              color="primary"
              to="/dashboard/blog-posts/new"
            >
              New Post
            </UButton>
          </div>
        </template>
      </DashboardHomeCard>
    </div>
    <div
      v-else
      class="flex justify-center items-center h-32 mt-8"
    >
      <ErrorState
        description="An error occurred while fetching the statistics"
        title="Failed to load statistics."
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DashboardHomeCard from '~/components/DashboardHomeCard.vue'
import type { DashboardStats } from '#shared/types/stats'
import dayjs from 'dayjs'

import relativeTime from 'dayjs/plugin/relativeTime'
import { Icons } from '#shared/consts/icons'

dayjs.extend(relativeTime)

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})

useHead({
  title: 'Dashboard - lysen.dev',
})

const greetings = [
  'Howdy, ### !',
  'Welcome back, ### !',
  'Good to see you again, ### !',
  'Hello, ### !',
  'Hi there, ### !',
  'Greetings, ### !',
  'What\'s up, ### !',
  'Hey, ### !',
  'Salutations, ### !',
  'Ahoy, ### !',
]
const userName = 'Vitaly'
const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]!.replace('###', userName)

const { data: stats, status } = await useFetch('/api/stats', {
  method: 'GET',
  server: true,
})

function getLastBlogPostDateColor(date?: DashboardStats['lastBlogPostDate']) {
  if (!date) return 'text-error'

  const MONTHS_1 = 30 * 24 * 60 * 60 * 1000
  const MONTHS_3 = 3 * MONTHS_1

  if (new Date(date) > new Date(Date.now() - MONTHS_1)) {
    return 'text-success'
  }
  else if (new Date(date) > new Date(Date.now() - MONTHS_3)) {
    return 'text-warning'
  }
  else {
    return 'text-error'
  }
}
</script>
