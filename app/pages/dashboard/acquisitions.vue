<template>
  <div>
    <DashboardHeader>
      <template #title>
        Acquisitions
      </template>
      <template #actions>
        <UButton
          :icon="Icons.acquisitions.generate"
          @click="openNewGenerationModal"
        >
          New Generation
        </UButton>
      </template>
    </DashboardHeader>

    <div class="p-4">
      <!-- Empty state -->
      <div v-if="!pending && (!acquisitions || acquisitions.length === 0)">
        <EmptyState
          :icon="Icons.acquisitions.dashboard"
          description="No CVs or cold emails generated yet. Click 'New Generation' to get started."
          title="No generations yet"
        />
      </div>

      <!-- Loading -->
      <div
        v-else-if="pending"
        class="flex items-center justify-center py-12"
      >
        <UIcon
          :name="Icons.ui.loading"
          class="animate-spin text-4xl text-muted"
        />
      </div>

      <!-- Acquisitions grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <div
          v-for="item in acquisitions"
          :key="item.id"
          class="border border-default rounded-lg bg-default flex flex-col gap-3 p-4 hover:shadow-md transition duration-200 cursor-pointer"
          @click="openDetail(item)"
        >
          <!-- Header -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <UIcon
                :name="item.type === 'cv' ? Icons.acquisitions.cv : Icons.acquisitions.email"
                class="text-lg shrink-0"
              />
              <span class="font-semibold capitalize">
                {{ item.type === 'cv' ? 'CV / Resume' : 'Cold Email' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <UBadge
                :color="statusColor(item.status)"
                :label="item.status"
                variant="soft"
                size="sm"
              />
              <UButton
                :icon="Icons.actions.delete"
                color="neutral"
                size="xs"
                variant="ghost"
                @click.stop="handleDelete(item.id)"
              />
            </div>
          </div>

          <!-- Tone & Date -->
          <div class="flex items-center gap-2 text-muted text-sm">
            <UBadge
              :label="item.tone"
              color="neutral"
              variant="outline"
              size="xs"
            />
            <span>·</span>
            <span>{{ formatDate(item.createdAt) }}</span>
          </div>

          <!-- Input preview -->
          <p class="text-sm text-muted line-clamp-2 border-l-2 border-default pl-2">
            {{ item.inputContent }}
          </p>

          <!-- Content preview or processing state -->
          <div
            v-if="item.status === 'processing' || (item.status === 'pending' && activeGenerationId === item.id)"
            class="flex items-center gap-2 text-sm text-primary"
          >
            <UIcon
              :name="Icons.ui.loading"
              class="animate-spin"
            />
            <span>Generating…</span>
          </div>
          <p
            v-else-if="item.generatedContent"
            class="text-sm line-clamp-3 text-toned"
          >
            {{ item.generatedContent }}
          </p>
          <div
            v-else-if="item.status === 'error'"
            class="text-sm text-error"
          >
            {{ item.errorMessage || 'Generation failed' }}
          </div>
        </div>
      </div>
    </div>

    <!-- New Generation Modal -->
    <UModal
      v-model:open="newGenerationOpen"
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #title>
        <h2 class="font-black text-2xl">
          New Generation
        </h2>
      </template>

      <template #body>
        <div class="flex flex-col gap-4">
          <!-- Type selector -->
          <div>
            <label class="text-sm font-medium mb-2 block">Type</label>
            <div class="flex gap-3">
              <button
                v-for="option in typeOptions"
                :key="option.value"
                :class="[
                  'flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border transition duration-200',
                  formState.type === option.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-default hover:border-primary/50',
                ]"
                @click="formState.type = option.value"
              >
                <UIcon
                  :name="option.icon"
                  class="text-2xl"
                />
                <span class="text-sm font-medium">{{ option.label }}</span>
              </button>
            </div>
          </div>

          <!-- Tone selector -->
          <div>
            <label class="text-sm font-medium mb-2 block">Tone</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tone in toneOptions"
                :key="tone.value"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm border transition duration-200',
                  formState.tone === tone.value
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-default hover:border-primary/50',
                ]"
                @click="formState.tone = tone.value"
              >
                {{ tone.label }}
              </button>
            </div>
          </div>

          <!-- Input -->
          <div>
            <label class="text-sm font-medium mb-2 block">
              Job Description / Recruiter Message
            </label>
            <UTextarea
              v-model="formState.inputContent"
              :rows="8"
              class="w-full font-mono text-sm"
              placeholder="Paste a job description, a message from a recruiter, or describe the opportunity…"
            />
            <p class="text-xs text-muted mt-1">
              Language will be automatically detected from your input.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 mt-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="newGenerationOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              :disabled="!formState.inputContent || formState.inputContent.length < 10 || isSubmitting"
              :icon="Icons.acquisitions.generate"
              :loading="isSubmitting"
              @click="handleSubmit"
            >
              Generate
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Detail / Result Modal -->
    <UModal
      v-model:open="detailOpen"
      :ui="{ content: 'max-w-3xl' }"
    >
      <template #title>
        <div class="flex items-center gap-3">
          <UIcon
            :name="selectedItem?.type === 'cv' ? Icons.acquisitions.cv : Icons.acquisitions.email"
            class="text-xl"
          />
          <h2 class="font-black text-2xl">
            {{ selectedItem?.type === 'cv' ? 'CV / Resume' : 'Cold Email' }}
          </h2>
          <UBadge
            v-if="selectedItem"
            :color="statusColor(selectedItem.status)"
            :label="selectedItem.status"
            variant="soft"
          />
        </div>
      </template>

      <template #body>
        <div
          v-if="selectedItem"
          class="flex flex-col gap-4"
        >
          <!-- Meta -->
          <div class="flex items-center gap-2 text-sm text-muted">
            <UBadge
              :label="selectedItem.tone"
              color="neutral"
              variant="outline"
              size="sm"
            />
            <span>·</span>
            <span>{{ formatDate(selectedItem.createdAt) }}</span>
          </div>

          <!-- Input -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
              Input
            </p>
            <p class="text-sm text-toned bg-elevated rounded-lg p-3 whitespace-pre-wrap">
              {{ selectedItem.inputContent }}
            </p>
          </div>

          <!-- Generated content -->
          <div v-if="selectedItem.status === 'processing' || isStreaming">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
              Generated Content
            </p>
            <div class="relative">
              <pre class="text-sm whitespace-pre-wrap font-sans bg-elevated rounded-lg p-3 min-h-32">{{ streamingContent || selectedItem.generatedContent }}</pre>
              <div class="flex items-center gap-2 text-sm text-primary mt-2">
                <UIcon
                  :name="Icons.ui.loading"
                  class="animate-spin"
                />
                <span>Generating…</span>
              </div>
            </div>
          </div>

          <div v-else-if="selectedItem.generatedContent">
            <div class="flex items-center justify-between mb-1">
              <p class="text-xs font-semibold uppercase tracking-wide text-muted">
                Generated Content
              </p>
              <UButton
                :icon="copied ? Icons.acquisitions.copied : Icons.acquisitions.copy"
                :label="copied ? 'Copied!' : 'Copy'"
                color="neutral"
                size="xs"
                variant="ghost"
                @click="copyContent"
              />
            </div>
            <pre class="text-sm whitespace-pre-wrap font-sans bg-elevated rounded-lg p-3 max-h-[50vh] overflow-y-auto">{{ selectedItem.generatedContent }}</pre>
          </div>

          <div
            v-else-if="selectedItem.status === 'error'"
            class="text-sm text-error bg-error/5 rounded-lg p-3"
          >
            {{ selectedItem.errorMessage || 'Generation failed' }}
          </div>

          <div
            v-else
            class="flex items-center gap-2 text-muted text-sm"
          >
            <UIcon
              :name="Icons.ui.loading"
              class="animate-spin"
            />
            <span>Waiting to start…</span>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import type { Acquisition } from '#shared/schemas/acquisition'
import DashboardHeader from '~/components/DashboardHeader.vue'
import dayjs from 'dayjs'

useHead({ title: 'Acquisitions - lysen.dev' })

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})

const toast = useToast()

// ---- Data ----
const { data: acquisitions, pending, refresh } = await useFetch('/api/acquisitions', {
  method: 'GET',
})

// ---- New generation form ----
const newGenerationOpen = ref(false)
const isSubmitting = ref(false)

const formState = reactive({
  type: 'cv' as 'cv' | 'cold-email',
  tone: 'professional' as 'professional' | 'casual' | 'enthusiastic' | 'concise',
  inputContent: '',
})

const typeOptions = [
  { value: 'cv' as const, label: 'CV / Resume', icon: Icons.acquisitions.cv },
  { value: 'cold-email' as const, label: 'Cold Email', icon: Icons.acquisitions.email },
]

const toneOptions = [
  { value: 'professional' as const, label: 'Professional' },
  { value: 'casual' as const, label: 'Casual' },
  { value: 'enthusiastic' as const, label: 'Enthusiastic' },
  { value: 'concise' as const, label: 'Concise' },
]

function openNewGenerationModal() {
  formState.type = 'cv'
  formState.tone = 'professional'
  formState.inputContent = ''
  newGenerationOpen.value = true
}

// ---- WebSocket for live streaming ----
const activeGenerationId = ref<number | null>(null)
const isStreaming = ref(false)
const streamingContent = ref('')

useGenerationWs(activeGenerationId, (event) => {
  if (event.type === 'status' && event.status === 'processing') {
    isStreaming.value = true
  }

  if (event.type === 'chunk') {
    streamingContent.value += event.text
    // Keep selected item content updated if it's the active one
    if (selectedItem.value && selectedItem.value.id === activeGenerationId.value) {
      selectedItem.value = { ...selectedItem.value, generatedContent: streamingContent.value }
    }
  }

  if (event.type === 'done') {
    isStreaming.value = false
    activeGenerationId.value = null
    streamingContent.value = ''
    refresh()
  }

  if (event.type === 'error') {
    isStreaming.value = false
    activeGenerationId.value = null
    streamingContent.value = ''
    toast.add({
      title: 'Generation failed',
      description: event.message,
      color: 'error',
      icon: Icons.ui.error,
    })
    refresh()
  }
})

async function handleSubmit() {
  if (!formState.inputContent || formState.inputContent.length < 10) return

  isSubmitting.value = true
  try {
    const result = await $fetch('/api/acquisitions', {
      method: 'POST',
      body: {
        type: formState.type,
        tone: formState.tone,
        inputContent: formState.inputContent,
      },
    })

    newGenerationOpen.value = false

    if (!result.acquisition) return

    // Connect WebSocket to track this generation
    activeGenerationId.value = result.acquisition.id
    streamingContent.value = ''

    // Open detail view immediately
    selectedItem.value = result.acquisition
    detailOpen.value = true

    await refresh()
  }
  catch (e) {
    console.error(e)
    toast.add({
      title: 'Error',
      description: 'Failed to start generation. Please try again.',
      color: 'error',
      icon: Icons.ui.error,
    })
  }
  finally {
    isSubmitting.value = false
  }
}

// ---- Detail view ----
const detailOpen = ref(false)
const selectedItem = ref<Acquisition | null>(null)
const copied = ref(false)

function openDetail(item: Acquisition) {
  selectedItem.value = item
  streamingContent.value = ''

  // If still processing, connect WS
  if (item.status === 'processing' || item.status === 'pending') {
    activeGenerationId.value = item.id
    isStreaming.value = item.status === 'processing'
  }

  detailOpen.value = true
}

async function copyContent() {
  if (!selectedItem.value?.generatedContent) return
  await navigator.clipboard.writeText(selectedItem.value.generatedContent)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

// ---- Delete ----
async function handleDelete(id: number) {
  if (!confirm('Delete this generation? This cannot be undone.')) return

  try {
    await $fetch(`/api/acquisitions/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Deleted', color: 'success', icon: Icons.ui.success })
    if (selectedItem.value?.id === id) detailOpen.value = false
    await refresh()
  }
  catch (e) {
    console.error(e)
    toast.add({ title: 'Error', description: 'Failed to delete.', color: 'error', icon: Icons.ui.error })
  }
}

// ---- Helpers ----
function statusColor(status: string) {
  switch (status) {
    case 'done': return 'success'
    case 'processing': return 'warning'
    case 'error': return 'error'
    default: return 'neutral'
  }
}

function formatDate(date: string) {
  return dayjs(date).format('MMM D, YYYY · HH:mm')
}
</script>
