<template>
  <div>
    <DashboardHeader>
      <template #title>
        Acquisitions
      </template>
      <template #actions>
        <div class="flex gap-2">
          <UButton
            :icon="Icons.acquisitions.template"
            color="neutral"
            variant="subtle"
            @click="openTemplateEditor"
          >
            Templates
          </UButton>
          <UButton
            :icon="Icons.acquisitions.generate"
            @click="openNewGenerationModal"
          >
            New Generation
          </UButton>
        </div>
      </template>
    </DashboardHeader>

    <div class="p-4">
      <div v-if="!pending && (!acquisitions || acquisitions.length === 0)">
        <EmptyState
          :icon="Icons.acquisitions.dashboard"
          description="No CVs or cold emails generated yet. Click 'New Generation' to get started."
          title="No generations yet"
        />
      </div>

      <div
        v-else-if="pending"
        class="flex items-center justify-center py-12"
      >
        <UIcon
          :name="Icons.ui.loading"
          class="animate-spin text-4xl text-muted"
        />
      </div>

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
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <UIcon
                :name="item.type === 'cv' ? Icons.acquisitions.cv : Icons.acquisitions.email"
                class="text-lg shrink-0"
              />
              <span class="font-semibold capitalize">{{ item.type === 'cv' ? 'CV / Resume' : 'Cold Email' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UBadge
                :color="statusColor(item.status)"
                :label="item.status"
                size="sm"
                variant="soft"
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

          <div class="flex items-center gap-2 text-muted text-sm">
            <UBadge
              :label="item.tone"
              color="neutral"
              size="xs"
              variant="outline"
            />
            <span>·</span>
            <span>{{ formatDate(item.createdAt) }}</span>
            <span v-if="item.inputBlocks">·</span>
            <span
              v-if="item.inputBlocks"
              class="text-xs"
            >{{ item.inputBlocks.length }} block{{ item.inputBlocks.length !== 1 ? 's' : '' }}</span>
          </div>

          <p class="text-sm text-muted line-clamp-2 border-l-2 border-default pl-2">
            {{ firstBlockPreview(item) }}
          </p>

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
          <!-- Type -->
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

          <!-- Tone -->
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

          <!-- Blocks -->
          <div>
            <label class="text-sm font-medium mb-2 block">Context Blocks</label>
            <div class="flex flex-col gap-2">
              <div
                v-for="(block, i) in formBlocks"
                :key="block._id"
                class="border border-default rounded-lg overflow-hidden"
              >
                <!-- Block header -->
                <div class="flex items-center gap-2 px-3 py-2 bg-elevated border-b border-default">
                  <UIcon
                    :name="blockIcon(block.type)"
                    class="text-muted shrink-0"
                  />
                  <input
                    v-model="block.label"
                    class="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted"
                    placeholder="Label…"
                  >
                  <UButton
                    :icon="Icons.actions.delete"
                    color="error"
                    size="xs"
                    variant="ghost"
                    @click="removeBlock(i)"
                  />
                </div>

                <!-- Text block -->
                <template v-if="block.type === 'text'">
                  <UTextarea
                    v-model="block.content"
                    :rows="5"
                    class="w-full rounded-none border-0"
                    placeholder="Paste recruiter message, job description, etc."
                  />
                </template>

                <!-- URL block -->
                <template v-else-if="block.type === 'url'">
                  <div class="p-3 flex flex-col gap-2">
                    <div class="flex gap-2">
                      <UInput
                        v-model="block.url"
                        class="flex-1"
                        placeholder="https://..."
                        @keydown.enter.prevent="fetchBlockUrl(i)"
                      />
                      <UButton
                        :disabled="!block.url || block.fetching"
                        :loading="block.fetching"
                        color="neutral"
                        variant="subtle"
                        @click="fetchBlockUrl(i)"
                      >
                        Fetch
                      </UButton>
                    </div>
                    <div
                      v-if="block.fetchedContent"
                      class="text-xs bg-elevated rounded p-2 max-h-28 overflow-y-auto text-muted font-mono leading-relaxed"
                    >
                      {{ block.fetchedContent.slice(0, 400) }}<span
                        v-if="block.fetchedContent.length > 400"
                        class="text-dimmed"
                      >… ({{ block.fetchedContent.length.toLocaleString() }} chars total)</span>
                    </div>
                    <p
                      v-else-if="block.fetchError"
                      class="text-xs text-error"
                    >
                      {{ block.fetchError }}
                    </p>
                  </div>
                </template>

                <!-- File block -->
                <template v-else-if="block.type === 'file'">
                  <div class="p-3">
                    <div
                      v-if="block.fileUrl"
                      class="flex items-center gap-2 text-sm"
                    >
                      <UIcon
                        class="text-muted"
                        name="i-mdi-paperclip"
                      />
                      <span class="flex-1 truncate">{{ block.fileName }}</span>
                      <UButton
                        :icon="Icons.actions.delete"
                        color="error"
                        size="xs"
                        variant="ghost"
                        @click="block.fileUrl = ''; block.fileName = ''"
                      />
                    </div>
                    <div
                      v-else
                      class="flex items-center gap-2"
                    >
                      <UFileUpload
                        :disabled="block.uploading"
                        :model-value="null"
                        accept="image/*,.pdf"
                        class="flex-1"
                        size="sm"
                        @update:model-value="(f) => f && handleFileBlockUpload(i, f as File)"
                      />
                      <UIcon
                        v-if="block.uploading"
                        :name="Icons.ui.loading"
                        class="animate-spin text-muted"
                      />
                    </div>
                  </div>
                </template>
              </div>

              <!-- Add block buttons -->
              <div class="flex gap-2 mt-1">
                <UButton
                  color="neutral"
                  size="sm"
                  variant="ghost"
                  @click="addBlock('text')"
                >
                  <UIcon name="i-mdi-text" />
                  Text
                </UButton>
                <UButton
                  color="neutral"
                  size="sm"
                  variant="ghost"
                  @click="addBlock('url')"
                >
                  <UIcon name="i-mdi-link" />
                  URL
                </UButton>
                <UButton
                  color="neutral"
                  size="sm"
                  variant="ghost"
                  @click="addBlock('file')"
                >
                  <UIcon name="i-mdi-paperclip" />
                  File
                </UButton>
              </div>
            </div>
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
              :disabled="!canSubmit || isSubmitting"
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

    <!-- Detail Modal -->
    <UModal
      v-model:open="detailOpen"
      :ui="{ content: 'max-w-3xl' }"
      @update:open="(v) => { if (!v) stopPolling() }"
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
              size="sm"
              variant="outline"
            />
            <span>·</span>
            <span>{{ formatDate(selectedItem.createdAt) }}</span>
          </div>

          <!-- Input (collapsible) -->
          <div>
            <button
              class="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wide text-muted mb-1 hover:text-default transition"
              @click="inputCollapsed = !inputCollapsed"
            >
              <span>Input{{ selectedItem.inputBlocks ? ` (${selectedItem.inputBlocks.length} block${selectedItem.inputBlocks.length !== 1 ? 's' : ''})` : '' }}</span>
              <UIcon :name="inputCollapsed ? 'i-mdi-chevron-down' : 'i-mdi-chevron-up'" />
            </button>

            <div
              v-if="!inputCollapsed"
              class="flex flex-col gap-2"
            >
              <!-- Structured blocks -->
              <template v-if="selectedItem.inputBlocks?.length">
                <div
                  v-for="(block, i) in selectedItem.inputBlocks"
                  :key="i"
                  class="border border-default rounded-lg overflow-hidden text-sm"
                >
                  <div class="flex items-center gap-2 px-3 py-1.5 bg-elevated border-b border-default text-xs text-muted">
                    <UIcon :name="blockIcon(block.type)" />
                    <span class="font-medium">{{ block.label }}</span>
                    <span
                      v-if="block.type === 'url'"
                      class="ml-auto truncate max-w-48 text-dimmed"
                    >{{ block.url }}</span>
                  </div>
                  <div class="p-3">
                    <template v-if="block.type === 'text'">
                      <p class="whitespace-pre-wrap text-toned">
                        {{ block.content }}
                      </p>
                    </template>
                    <template v-else-if="block.type === 'url'">
                      <p class="text-muted max-h-32 overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed">
                        {{ block.fetchedContent }}
                      </p>
                    </template>
                    <template v-else-if="block.type === 'file'">
                      <a
                        :href="block.fileUrl"
                        class="flex items-center gap-1 text-primary underline"
                        target="_blank"
                      >
                        <UIcon name="i-mdi-paperclip" />
                        {{ block.fileName }}
                      </a>
                    </template>
                  </div>
                </div>
              </template>

              <!-- Legacy plain text -->
              <p
                v-else
                class="text-sm text-toned bg-elevated rounded-lg p-3 whitespace-pre-wrap"
              >
                {{ selectedItem.inputContent }}
              </p>
            </div>
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
            <pre class="text-sm whitespace-pre-wrap font-sans bg-elevated rounded-lg p-3 max-h-[55vh] overflow-y-auto">{{ selectedItem.generatedContent }}</pre>
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

          <!-- PDF Generation (CV only, done status) -->
          <div
            v-if="selectedItem.type === 'cv' && selectedItem.status === 'done'"
            class="border-t border-default pt-4 mt-2"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold uppercase tracking-wide text-muted">
                PDF Export
              </p>
              <div v-if="selectedItem.pdfUrl && selectedItem.pdfStatus === 'done'">
                <UButton
                  :icon="Icons.acquisitions.download"
                  :to="selectedItem.pdfUrl"
                  color="success"
                  size="xs"
                  target="_blank"
                  variant="subtle"
                >
                  Download PDF
                </UButton>
              </div>
            </div>

            <div
              v-if="selectedItem.pdfStatus === 'processing' || isPdfGenerating"
              class="flex items-center gap-2 text-sm text-primary"
            >
              <UIcon
                :name="Icons.ui.loading"
                class="animate-spin"
              />
              <span>Generating PDF…</span>
            </div>
            <div
              v-else-if="selectedItem.pdfStatus === 'error'"
              class="text-xs text-error mb-2"
            >
              PDF generation failed. Try again.
            </div>

            <div class="flex gap-2 flex-wrap">
              <UButton
                :disabled="selectedItem.pdfStatus === 'processing' || isPdfGenerating"
                :loading="selectedItem.pdfStatus === 'processing' || isPdfGenerating"
                color="neutral"
                size="sm"
                variant="subtle"
                @click="triggerPdfGeneration('eu')"
              >
                <UIcon
                  class="text-error"
                  name="i-mdi-file-pdf-box"
                />
                EU Standard
              </UButton>
              <UButton
                :disabled="selectedItem.pdfStatus === 'processing' || isPdfGenerating"
                :loading="selectedItem.pdfStatus === 'processing' || isPdfGenerating"
                color="neutral"
                size="sm"
                variant="subtle"
                @click="triggerPdfGeneration('us')"
              >
                <UIcon
                  class="text-error"
                  name="i-mdi-file-pdf-box"
                />
                US Standard
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Template Editor Modal -->
    <UModal
      v-model:open="templateEditorOpen"
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #title>
        <h2 class="font-black text-2xl">
          CV Templates
        </h2>
      </template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="flex gap-2">
            <UButton
              v-for="t in ['eu', 'us']"
              :key="t"
              :color="activeTemplate === t ? 'primary' : 'neutral'"
              :variant="activeTemplate === t ? 'solid' : 'ghost'"
              size="sm"
              @click="activeTemplate = t as 'eu' | 'us'"
            >
              {{ t.toUpperCase() }} Standard
            </UButton>
          </div>

          <p class="text-xs text-muted">
            Full HTML template. Use <code class="bg-elevated px-1 rounded">&#123;&#123;content&#125;&#125;</code> where the markdown-rendered CV content should appear.
          </p>

          <textarea
            v-model="templateHtml[activeTemplate]"
            class="w-full h-96 font-mono text-xs bg-elevated border border-default rounded-lg p-3 outline-none resize-none focus:border-primary"
            spellcheck="false"
          />

          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="templateEditorOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              :icon="Icons.actions.save"
              :loading="savingTemplate"
              @click="saveTemplate"
            >
              Save Template
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import type { Acquisition } from '#shared/schemas/acquisition'
import type { InputBlock } from '#shared/types/acquisition-blocks'
import DashboardHeader from '~/components/DashboardHeader.vue'
import dayjs from 'dayjs'

type FormTextBlock = { _id: number, type: 'text', label: string, content: string }
type FormUrlBlock = { _id: number, type: 'url', label: string, url: string, fetchedContent: string, fetching: boolean, fetchError: string }
type FormFileBlock = { _id: number, type: 'file', label: string, fileUrl: string, fileName: string, uploading: boolean }
type FormBlock = FormTextBlock | FormUrlBlock | FormFileBlock

useHead({ title: 'Acquisitions - lysen.dev' })

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})

const toast = useToast()

// ---- Data ----
const { data: acquisitions, pending, refresh } = await useFetch('/api/acquisitions', { method: 'GET' })

// ---- New generation form ----
const newGenerationOpen = ref(false)
const isSubmitting = ref(false)
let _blockId = 0

const formState = reactive({
  type: 'cv' as 'cv' | 'cold-email',
  tone: 'professional' as 'professional' | 'casual' | 'enthusiastic' | 'concise',
})

const formBlocks = ref<FormBlock[]>([])

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

const canSubmit = computed(() => {
  if (!formBlocks.value.length) return false
  return formBlocks.value.some((b) => {
    if (b.type === 'text') return b.content.trim().length >= 10
    if (b.type === 'url') return b.fetchedContent.trim().length > 0
    if (b.type === 'file') return b.fileUrl.length > 0
    return false
  })
})

function blockIcon(type: string) {
  if (type === 'text') return 'i-mdi-text'
  if (type === 'url') return 'i-mdi-link'
  if (type === 'file') return 'i-mdi-paperclip'
  return 'i-mdi-block-helper'
}

function addBlock(type: 'text' | 'url' | 'file') {
  const id = ++_blockId
  if (type === 'text') {
    formBlocks.value.push({ _id: id, type: 'text', label: 'Message', content: '' })
  }
  else if (type === 'url') {
    formBlocks.value.push({ _id: id, type: 'url', label: 'Link', url: '', fetchedContent: '', fetching: false, fetchError: '' })
  }
  else {
    formBlocks.value.push({ _id: id, type: 'file', label: 'Attachment', fileUrl: '', fileName: '', uploading: false })
  }
}

function removeBlock(index: number) {
  formBlocks.value.splice(index, 1)
}

async function fetchBlockUrl(index: number) {
  const block = formBlocks.value[index]!
  if (block.type !== 'url' || !block.url) return

  block.fetching = true
  block.fetchError = ''
  try {
    const res = await $fetch('/api/acquisitions/fetch-url', {
      method: 'POST',
      body: { url: block.url },
    })
    block.fetchedContent = res.content
  }
  catch (e) {
    block.fetchError = (e as Record<string, Record<string, string>>)?.data?.statusMessage || 'Failed to fetch URL'
  }
  finally {
    block.fetching = false
  }
}

async function handleFileBlockUpload(index: number, file: File) {
  const block = formBlocks.value[index]!
  if (block.type !== 'file') return

  block.uploading = true
  const formData = new FormData()
  formData.append('images', file)
  try {
    const res = await $fetch('/api/upload', { method: 'POST', body: formData })
    const upload = res.uploads[0]
    if (upload?.success) {
      block.fileUrl = upload.href
      block.fileName = file.name
    }
    else {
      toast.add({ title: 'Upload failed', color: 'error', icon: Icons.ui.error })
    }
  }
  catch {
    toast.add({ title: 'Upload failed', color: 'error', icon: Icons.ui.error })
  }
  finally {
    block.uploading = false
  }
}

function openNewGenerationModal() {
  formState.type = 'cv'
  formState.tone = 'professional'
  formBlocks.value = []
  addBlock('text')
  newGenerationOpen.value = true
}

// ---- WebSocket ----
const activeGenerationId = ref<number | null>(null)
const isStreaming = ref(false)
const streamingContent = ref('')
const isPdfGenerating = ref(false)

// ---- Polling fallback ----
let _pollTimer: ReturnType<typeof setInterval> | null = null

function stopPolling() {
  if (_pollTimer) {
    clearInterval(_pollTimer)
    _pollTimer = null
  }
}

function startPolling(id: number) {
  stopPolling()
  _pollTimer = setInterval(async () => {
    try {
      const item = await $fetch(`/api/acquisitions/${id}`) as import('#shared/schemas/acquisition').Acquisition
      if (item.status === 'done' || item.status === 'error') {
        stopPolling()
        isStreaming.value = false
        streamingContent.value = ''
        if (selectedItem.value?.id === id) {
          selectedItem.value = item
          inputCollapsed.value = true
        }
        if (activeGenerationId.value === id) activeGenerationId.value = null
        if (item.status === 'error') {
          toast.add({ title: 'Generation failed', description: item.errorMessage || '', color: 'error', icon: Icons.ui.error })
        }
        await refresh()
      }
      else if (item.status === 'processing' && selectedItem.value?.id === id && !isStreaming.value) {
        // WS streaming active — polling handles status badge only
        selectedItem.value = { ...selectedItem.value, status: item.status }
      }
    }
    catch { /* ignore */ }
  }, 3000)
}

onUnmounted(() => stopPolling())

useGenerationWs(activeGenerationId, (event) => {
  if (event.type === 'status' && event.status === 'processing') {
    isStreaming.value = true
  }
  if (event.type === 'chunk') {
    streamingContent.value += event.text
    if (selectedItem.value?.id === activeGenerationId.value) {
      selectedItem.value = { ...selectedItem.value, generatedContent: streamingContent.value }
    }
  }
  if (event.type === 'done') {
    stopPolling()
    isStreaming.value = false
    activeGenerationId.value = null
    streamingContent.value = ''
    if (selectedItem.value) inputCollapsed.value = true
    refresh()
  }
  if (event.type === 'error') {
    stopPolling()
    isStreaming.value = false
    activeGenerationId.value = null
    streamingContent.value = ''
    toast.add({ title: 'Generation failed', description: event.message, color: 'error', icon: Icons.ui.error })
    refresh()
  }
  if (event.type === 'pdf-status') {
    isPdfGenerating.value = event.status === 'processing'
    if (selectedItem.value) {
      selectedItem.value = { ...selectedItem.value, pdfStatus: event.status }
    }
  }
  if (event.type === 'pdf-done') {
    isPdfGenerating.value = false
    if (selectedItem.value) {
      selectedItem.value = { ...selectedItem.value, pdfStatus: 'done', pdfUrl: event.pdfUrl }
    }
    toast.add({ title: 'PDF ready', color: 'success', icon: Icons.ui.success })
    refresh()
  }
  if (event.type === 'pdf-error') {
    isPdfGenerating.value = false
    if (selectedItem.value) {
      selectedItem.value = { ...selectedItem.value, pdfStatus: 'error' }
    }
    toast.add({ title: 'PDF failed', description: event.message, color: 'error', icon: Icons.ui.error })
  }
})

async function handleSubmit() {
  if (!canSubmit.value) return

  isSubmitting.value = true
  try {
    const blocks: InputBlock[] = formBlocks.value.map((b) => {
      if (b.type === 'text') return { type: 'text', label: b.label, content: b.content }
      if (b.type === 'url') return { type: 'url', label: b.label, url: b.url, fetchedContent: b.fetchedContent }
      return { type: 'file', label: b.label, fileUrl: b.fileUrl, fileName: b.fileName }
    })

    const result = await $fetch('/api/acquisitions', {
      method: 'POST',
      body: { type: formState.type, tone: formState.tone, blocks },
    })

    newGenerationOpen.value = false
    if (!result.acquisition) return

    activeGenerationId.value = result.acquisition.id
    streamingContent.value = ''
    selectedItem.value = result.acquisition
    inputCollapsed.value = false
    detailOpen.value = true
    startPolling(result.acquisition.id)

    await refresh()
  }
  catch (e) {
    console.error(e)
    toast.add({ title: 'Error', description: 'Failed to start generation.', color: 'error', icon: Icons.ui.error })
  }
  finally {
    isSubmitting.value = false
  }
}

// ---- Detail view ----
const detailOpen = ref(false)
const selectedItem = ref<Acquisition | null>(null)
const copied = ref(false)
const inputCollapsed = ref(false)

function openDetail(item: Acquisition) {
  selectedItem.value = item
  streamingContent.value = ''
  inputCollapsed.value = !!item.generatedContent
  isPdfGenerating.value = item.pdfStatus === 'processing'

  if (item.status === 'processing' || item.status === 'pending') {
    activeGenerationId.value = item.id
    isStreaming.value = item.status === 'processing'
    startPolling(item.id)
  }

  detailOpen.value = true
}

// ---- PDF generation ----
async function triggerPdfGeneration(templateType: 'eu' | 'us') {
  if (!selectedItem.value) return
  isPdfGenerating.value = true
  activeGenerationId.value = selectedItem.value.id
  try {
    await $fetch(`/api/acquisitions/${selectedItem.value.id}/generate-pdf`, {
      method: 'POST',
      body: { templateType },
    })
  }
  catch (e) {
    console.error(e)
    isPdfGenerating.value = false
    toast.add({ title: 'Error', description: 'Failed to start PDF generation.', color: 'error', icon: Icons.ui.error })
  }
}

// ---- Template editor ----
const templateEditorOpen = ref(false)
const activeTemplate = ref<'eu' | 'us'>('eu')
const savingTemplate = ref(false)
const templateHtml = reactive<{ eu: string, us: string }>({ eu: '', us: '' })

async function openTemplateEditor() {
  try {
    const templates = await $fetch('/api/cv-templates', { method: 'GET' })
    templateHtml.eu = templates.eu
    templateHtml.us = templates.us
  }
  catch {
    toast.add({ title: 'Failed to load templates', color: 'error', icon: Icons.ui.error })
    return
  }
  templateEditorOpen.value = true
}

async function saveTemplate() {
  savingTemplate.value = true
  try {
    await $fetch(`/api/cv-templates/${activeTemplate.value}`, {
      method: 'PATCH',
      body: { html: templateHtml[activeTemplate.value] },
    })
    toast.add({ title: 'Template saved', color: 'success', icon: Icons.ui.success })
  }
  catch {
    toast.add({ title: 'Failed to save template', color: 'error', icon: Icons.ui.error })
  }
  finally {
    savingTemplate.value = false
  }
}

async function copyContent() {
  if (!selectedItem.value?.generatedContent) return
  await navigator.clipboard.writeText(selectedItem.value.generatedContent)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

// ---- Delete ----
async function handleDelete(id: number) {
  if (!confirm('Delete this generation?')) return
  try {
    await $fetch(`/api/acquisitions/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Deleted', color: 'success', icon: Icons.ui.success })
    if (selectedItem.value?.id === id) detailOpen.value = false
    await refresh()
  }
  catch {
    toast.add({ title: 'Error', description: 'Failed to delete.', color: 'error', icon: Icons.ui.error })
  }
}

// ---- Helpers ----
function firstBlockPreview(item: Acquisition): string {
  if (item.inputBlocks?.length) {
    const first = item.inputBlocks[0]!
    if (first.type === 'text') return first.content
    if (first.type === 'url') return first.fetchedContent || first.url
    if (first.type === 'file') return first.fileName
  }
  return item.inputContent
}

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
