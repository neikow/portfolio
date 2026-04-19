<template>
  <div>
    <DashboardHeader>
      <template #title>
        Education & Certifications
      </template>

      <template #actions>
        <div class="flex gap-2">
          <!-- Add Education -->
          <UModal v-model:open="educationModalOpen">
            <UButton
              :icon="Icons.education.dashboard"
              @click="resetEducationForm"
            >
              Add Education
            </UButton>

            <template #title>
              <h2 class="font-black text-2xl">
                {{ isEditingEducation ? 'Edit Education' : 'New Education' }}
              </h2>
            </template>

            <template #body>
              <UForm
                :schema="educationSchema"
                :state="educationFormState"
                @error="console.log($event)"
                @submit="handleEducationSubmit"
              >
                <div class="flex flex-col gap-2">
                  <UFormField
                    label="School / Institution"
                    name="school"
                  >
                    <UInput
                      v-model="educationFormState.school"
                      class="w-full"
                      placeholder="e.g. École Centrale Méditerranée"
                      required
                    />
                  </UFormField>

                  <div class="flex gap-4">
                    <UFormField
                      class="flex-1"
                      label="Degree"
                      name="degree"
                    >
                      <UInput
                        v-model="educationFormState.degree"
                        class="w-full"
                        placeholder="e.g. Master of Engineering"
                        required
                      />
                    </UFormField>

                    <UFormField
                      class="flex-1"
                      label="Field of Study"
                      name="field"
                    >
                      <UInput
                        v-model="educationFormState.field"
                        class="w-full"
                        placeholder="e.g. Computer Science"
                        required
                      />
                    </UFormField>
                  </div>

                  <UFormField
                    label="Description"
                    name="description"
                  >
                    <UTextarea
                      v-model="educationFormState.description"
                      :rows="3"
                      class="w-full"
                      placeholder="Describe your studies, focus areas, etc."
                    />
                  </UFormField>

                  <div class="flex gap-4">
                    <UFormField
                      class="flex-1"
                      label="Start Date"
                      name="startDate"
                    >
                      <UPopover>
                        <UButton
                          :icon="Icons.ui.calendar"
                          class="w-full"
                          color="neutral"
                          variant="subtle"
                        >
                          {{ eduStartDate ? df.format(eduStartDate.toDate(getLocalTimeZone())) : 'Select a date' }}
                        </UButton>
                        <template #content>
                          <UCalendar
                            v-model="eduStartDate"
                            class="p-2"
                          />
                        </template>
                      </UPopover>
                    </UFormField>

                    <UFormField
                      class="flex-1"
                      label="End Date"
                      name="endDate"
                    >
                      <UPopover>
                        <div class="flex gap-1">
                          <UButton
                            :icon="Icons.ui.calendar"
                            class="w-full"
                            color="neutral"
                            variant="subtle"
                          >
                            {{ eduEndDate ? df.format(eduEndDate.toDate(getLocalTimeZone())) : 'Select a date' }}
                          </UButton>
                          <UButton
                            :icon="Icons.actions.delete"
                            color="neutral"
                            variant="subtle"
                            @click="eduEndDate = null"
                          />
                        </div>
                        <template #content>
                          <UCalendar
                            v-model="eduEndDate"
                            class="p-2"
                          />
                        </template>
                      </UPopover>
                    </UFormField>
                  </div>

                  <UFormField
                    label="School Logo"
                    name="logoUrl"
                  >
                    <LogoUploadInput
                      :model-value="educationFormState.logoUrl ?? ''"
                      :placeholder-icon="Icons.education.icon"
                      alt="School logo"
                      @update:model-value="educationFormState.logoUrl = $event"
                    />
                  </UFormField>

                  <UFormField
                    label="School Website"
                    name="websiteUrl"
                  >
                    <UInput
                      v-model="educationFormState.websiteUrl"
                      class="w-full"
                      placeholder="https://school.edu"
                    />
                  </UFormField>

                  <div class="my-2 border-b border-default" />

                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-base">
                      School Projects
                    </h3>
                    <UButton
                      :icon="Icons.actions.add"
                      color="neutral"
                      size="sm"
                      variant="ghost"
                      @click="addSchoolProject"
                    >
                      Add Project
                    </UButton>
                  </div>

                  <div
                    v-for="(project, index) in schoolProjectsForm"
                    :key="index"
                    class="border border-default rounded-lg p-3 flex flex-col gap-2"
                  >
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-muted">Project {{ index + 1 }}</span>
                      <UButton
                        :icon="Icons.actions.delete"
                        color="error"
                        size="xs"
                        variant="ghost"
                        @click="removeSchoolProject(index)"
                      />
                    </div>
                    <UInput
                      v-model="project.name"
                      class="w-full"
                      placeholder="Project name"
                    />
                    <UTextarea
                      v-model="project.description"
                      :rows="2"
                      class="w-full"
                      placeholder="Short description"
                    />
                    <div class="flex gap-2">
                      <UInput
                        v-model="project.url"
                        class="flex-1"
                        placeholder="Live URL (optional)"
                      />
                      <UInput
                        v-model="project.repoUrl"
                        class="flex-1"
                        placeholder="Repo URL (optional)"
                      />
                    </div>
                    <UInput
                      v-model="project.tagsRaw"
                      class="w-full"
                      placeholder="Tags (comma-separated)"
                    />
                    <div class="flex items-center gap-2">
                      <UFileUpload
                        :model-value="null"
                        accept=".pdf,application/pdf"
                        class="flex-1"
                        size="sm"
                        @update:model-value="(f) => onProjectPdfFileChange(index, f)"
                      />
                      <span
                        v-if="project.pdfUrl"
                        class="text-xs text-success flex items-center gap-1"
                      >
                        <UIcon name="i-mdi-file-pdf-box" />
                        PDF uploaded
                        <UButton
                          :icon="Icons.actions.delete"
                          color="error"
                          size="xs"
                          variant="ghost"
                          @click="project.pdfUrl = null"
                        />
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-row justify-end w-full gap-2 mt-4">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      @click="educationModalOpen = false"
                    >
                      Cancel
                    </UButton>
                    <UButton
                      :icon="isEditingEducation ? Icons.actions.edit : Icons.actions.add"
                      color="primary"
                      type="submit"
                    >
                      {{ isEditingEducation ? 'Save' : 'Create' }}
                    </UButton>
                  </div>
                </div>
              </UForm>
            </template>
          </UModal>

          <!-- Add Certification -->
          <UModal v-model:open="certModalOpen">
            <UButton
              :icon="Icons.certifications.dashboard"
              color="secondary"
              @click="resetCertForm"
            >
              Add Certification
            </UButton>

            <template #title>
              <h2 class="font-black text-2xl">
                {{ isEditingCert ? 'Edit Certification' : 'New Certification' }}
              </h2>
            </template>

            <template #body>
              <UForm
                :schema="certSchema"
                :state="certFormState"
                @error="console.log($event)"
                @submit="handleCertSubmit"
              >
                <div class="flex flex-col gap-2">
                  <UFormField
                    label="Certification Name"
                    name="name"
                  >
                    <UInput
                      v-model="certFormState.name"
                      class="w-full"
                      placeholder="e.g. AWS Solutions Architect"
                      required
                    />
                  </UFormField>

                  <UFormField
                    label="Issuing Organization"
                    name="issuer"
                  >
                    <UInput
                      v-model="certFormState.issuer"
                      class="w-full"
                      placeholder="e.g. Amazon Web Services"
                      required
                    />
                  </UFormField>

                  <UFormField
                    label="Issuer Website"
                    name="issuerUrl"
                  >
                    <UInput
                      v-model="certFormState.issuerUrl"
                      class="w-full"
                      placeholder="https://aws.amazon.com/certification"
                    />
                  </UFormField>

                  <UFormField
                    label="Issuer Logo"
                    name="logoUrl"
                  >
                    <LogoUploadInput
                      :model-value="certFormState.logoUrl ?? ''"
                      :placeholder-icon="Icons.certifications.icon"
                      alt="Issuer logo"
                      @update:model-value="certFormState.logoUrl = $event"
                    />
                  </UFormField>

                  <div class="flex gap-4">
                    <UFormField
                      class="flex-1"
                      label="Issued At"
                      name="issuedAt"
                    >
                      <UPopover>
                        <UButton
                          :icon="Icons.ui.calendar"
                          class="w-full"
                          color="neutral"
                          variant="subtle"
                        >
                          {{ certIssuedDate ? df.format(certIssuedDate.toDate(getLocalTimeZone())) : 'Select a date' }}
                        </UButton>
                        <template #content>
                          <UCalendar
                            v-model="certIssuedDate"
                            class="p-2"
                          />
                        </template>
                      </UPopover>
                    </UFormField>

                    <UFormField
                      class="flex-1"
                      label="Expires At"
                      name="expiresAt"
                    >
                      <UPopover>
                        <div class="flex gap-1">
                          <UButton
                            :icon="Icons.ui.calendar"
                            class="w-full"
                            color="neutral"
                            variant="subtle"
                          >
                            {{ certExpiresDate ? df.format(certExpiresDate.toDate(getLocalTimeZone())) : 'No expiry' }}
                          </UButton>
                          <UButton
                            :icon="Icons.actions.delete"
                            color="neutral"
                            variant="subtle"
                            @click="certExpiresDate = null"
                          />
                        </div>
                        <template #content>
                          <UCalendar
                            v-model="certExpiresDate"
                            class="p-2"
                          />
                        </template>
                      </UPopover>
                    </UFormField>
                  </div>

                  <UFormField
                    label="Credential URL"
                    name="credentialUrl"
                  >
                    <UInput
                      v-model="certFormState.credentialUrl"
                      class="w-full"
                      placeholder="https://www.credly.com/badges/..."
                    />
                  </UFormField>

                  <UFormField
                    label="Description"
                    name="description"
                  >
                    <UTextarea
                      v-model="certFormState.description"
                      :rows="2"
                      class="w-full"
                      placeholder="Optional description"
                    />
                  </UFormField>

                  <div class="flex flex-row justify-end w-full gap-2 mt-4">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      @click="certModalOpen = false"
                    >
                      Cancel
                    </UButton>
                    <UButton
                      :icon="isEditingCert ? Icons.actions.edit : Icons.actions.add"
                      color="primary"
                      type="submit"
                    >
                      {{ isEditingCert ? 'Save' : 'Create' }}
                    </UButton>
                  </div>
                </div>
              </UForm>
            </template>
          </UModal>
        </div>
      </template>
    </DashboardHeader>

    <div class="my-4 mx-4 flex flex-col gap-8">
      <!-- Education -->
      <section>
        <h2 class="text-xl font-bold mb-3">
          Education
        </h2>
        <div v-if="educationStatus === 'pending'">
          Loading...
        </div>
        <div v-else-if="!educations?.length">
          <EmptyState
            :icon="Icons.education.empty"
            description="No education entries yet. Add your first degree above."
            title="No education yet"
          />
        </div>
        <div
          v-else
          class="flex flex-col gap-2"
        >
          <div
            v-for="edu in educations"
            :key="edu.id"
            class="flex flex-col sm:flex-row border border-default rounded-lg bg-default p-4 gap-4 items-start"
          >
            <img
              v-if="edu.logoUrl"
              :alt="edu.school"
              :src="edu.logoUrl"
              class="h-12 w-12 object-contain flex-shrink-0"
            >
            <div
              v-else
              class="h-12 w-12 bg-inverted rounded-lg flex items-center justify-center text-inverted text-xl flex-shrink-0"
            >
              <UIcon :name="Icons.education.icon" />
            </div>
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <h3 class="font-bold text-base">
                  {{ edu.degree }} in {{ edu.field }}
                </h3>
                <span class="text-muted text-sm">@ {{ edu.school }}</span>
              </div>
              <div class="text-muted text-sm flex gap-1 items-center mt-1">
                <UIcon :name="Icons.ui.calendar" />
                {{ df.format(new Date(edu.startDate)) }} -
                {{ edu.endDate ? df.format(new Date(edu.endDate)) : 'Present' }}
              </div>
              <p
                v-if="edu.description"
                class="mt-1 text-sm"
              >
                {{ edu.description }}
              </p>
              <div
                v-if="edu.schoolProjects.length"
                class="mt-2 flex flex-wrap gap-1"
              >
                <UBadge
                  v-for="p in edu.schoolProjects"
                  :key="p.name"
                  :icon="Icons.education.project"
                  :label="p.name"
                  color="neutral"
                  size="sm"
                  variant="subtle"
                />
              </div>
            </div>
            <div class="flex flex-row sm:flex-col gap-2">
              <UButton
                :icon="Icons.actions.edit"
                @click="handleEditEducation(edu.id)"
              />
              <UButton
                :icon="Icons.actions.delete"
                color="error"
                @click="handleDeleteEducation(edu.id)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Certifications -->
      <section>
        <h2 class="text-xl font-bold mb-3">
          Certifications
        </h2>
        <div v-if="certStatus === 'pending'">
          Loading...
        </div>
        <div v-else-if="!certifications?.length">
          <EmptyState
            :icon="Icons.certifications.empty"
            description="No certifications yet. Add your first one above."
            title="No certifications yet"
          />
        </div>
        <div
          v-else
          class="flex flex-col gap-2"
        >
          <div
            v-for="cert in certifications"
            :key="cert.id"
            class="flex flex-col sm:flex-row border border-default rounded-lg bg-default p-4 gap-4 items-start"
          >
            <img
              v-if="cert.logoUrl"
              :alt="cert.issuer"
              :src="cert.logoUrl"
              class="h-12 w-12 object-contain flex-shrink-0"
            >
            <div
              v-else
              class="h-12 w-12 bg-inverted rounded-lg flex items-center justify-center text-inverted text-xl flex-shrink-0"
            >
              <UIcon :name="Icons.certifications.icon" />
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-base">
                {{ cert.name }}
              </h3>
              <div class="flex gap-2 items-center mt-1">
                <a
                  v-if="cert.issuerUrl"
                  :href="cert.issuerUrl"
                  class="text-sm text-primary underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {{ cert.issuer }}
                </a>
                <span
                  v-else
                  class="text-sm text-muted"
                >{{ cert.issuer }}</span>
                <span class="text-muted text-xs">·</span>
                <span class="text-muted text-sm">{{ df.format(new Date(cert.issuedAt)) }}</span>
                <UBadge
                  v-if="cert.expiresAt && new Date(cert.expiresAt) < new Date()"
                  color="warning"
                  label="Expired"
                  size="xs"
                />
              </div>
              <p
                v-if="cert.description"
                class="mt-1 text-sm"
              >
                {{ cert.description }}
              </p>
              <UButton
                v-if="cert.credentialUrl"
                :icon="Icons.ui.externalLink"
                :to="cert.credentialUrl"
                class="mt-2"
                color="neutral"
                size="xs"
                target="_blank"
                variant="subtle"
              >
                View Credential
              </UButton>
            </div>
            <div class="flex flex-row sm:flex-col gap-2">
              <UButton
                :icon="Icons.actions.edit"
                @click="handleEditCert(cert.id)"
              />
              <UButton
                :icon="Icons.actions.delete"
                color="error"
                @click="handleDeleteCert(cert.id)"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import DashboardHeader from '~/components/DashboardHeader.vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { SchoolProject } from '#shared/schemas/education'

useHead({ title: 'Education & Certifications - lysen.dev' })

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})

const toast = useToast()
const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const today = new Date()

// ─── Education ───────────────────────────────────────────────────────────────

const educationModalOpen = ref(new URL(window.location.href).searchParams.has('new') || false)
const { data: educations, status: educationStatus, refresh: refreshEducation } = await useFetch('/api/education', { method: 'GET' })

type SchoolProjectForm = SchoolProject & { tagsRaw: string }

const educationSchema = z.object({
  id: z.number().optional(),
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().nullable().optional(),
})

const eduStartDate = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
const eduEndDate = shallowRef<CalendarDate | null>(null)

watch(eduStartDate, (v) => {
  educationFormState.startDate = v.toDate(getLocalTimeZone()).toISOString()
})
watch(eduEndDate, (v) => {
  educationFormState.endDate = v ? v.toDate(getLocalTimeZone()).toISOString() : null
})

type EduFormData = z.infer<typeof educationSchema>

const educationFormState = reactive<EduFormData>({
  school: '',
  degree: '',
  field: '',
  description: '',
  startDate: eduStartDate.value.toDate(getLocalTimeZone()).toISOString(),
  endDate: null,
  logoUrl: '',
  websiteUrl: '',
})

const schoolProjectsForm = ref<SchoolProjectForm[]>([])

const isEditingEducation = computed(() => educationFormState.id !== undefined)

function resetEducationForm() {
  educationFormState.id = undefined
  educationFormState.school = ''
  educationFormState.degree = ''
  educationFormState.field = ''
  educationFormState.description = ''
  educationFormState.logoUrl = ''
  educationFormState.websiteUrl = ''
  eduStartDate.value = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  eduEndDate.value = null
  schoolProjectsForm.value = []
}

function addSchoolProject() {
  schoolProjectsForm.value.push({ name: '', description: '', url: null, repoUrl: null, pdfUrl: null, tags: [], tagsRaw: '' })
}

function onProjectPdfFileChange(index: number, f: unknown) {
  if (f instanceof File) handleProjectPdfUpload(index, f)
}

async function handleProjectPdfUpload(index: number, file: File) {
  const formData = new FormData()
  formData.append('images', file)
  try {
    const res = await $fetch('/api/upload', { method: 'POST', body: formData })
    const upload = res.uploads[0]
    if (upload?.success) {
      schoolProjectsForm.value[index]!.pdfUrl = upload.href
    }
    else {
      toast.add({ title: 'PDF upload failed', color: 'error', icon: Icons.ui.error })
    }
  }
  catch {
    toast.add({ title: 'PDF upload failed', color: 'error', icon: Icons.ui.error })
  }
}

function removeSchoolProject(index: number) {
  schoolProjectsForm.value.splice(index, 1)
}

async function handleEducationSubmit(event: FormSubmitEvent<EduFormData>) {
  const schoolProjects = schoolProjectsForm.value.map(p => ({
    name: p.name,
    description: p.description,
    url: p.url || null,
    repoUrl: p.repoUrl || null,
    pdfUrl: p.pdfUrl || null,
    tags: p.tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
  }))

  const payload = { ...event.data, schoolProjects }

  try {
    if (isEditingEducation.value) {
      await $fetch(`/api/education/${educationFormState.id}`, { method: 'PATCH', body: payload })
      toast.add({ title: 'Saved', color: 'success', icon: Icons.ui.success })
    }
    else {
      await $fetch('/api/education', { method: 'POST', body: payload })
      toast.add({ title: 'Created', color: 'success', icon: Icons.ui.success })
    }
    educationModalOpen.value = false
    await refreshEducation()
  }
  catch {
    toast.add({ title: 'Error', color: 'error', icon: Icons.ui.error })
  }
}

function handleEditEducation(id: number) {
  const edu = educations.value?.find(e => e.id === id)
  if (!edu) return

  educationFormState.id = id
  educationFormState.school = edu.school
  educationFormState.degree = edu.degree
  educationFormState.field = edu.field
  educationFormState.description = edu.description
  educationFormState.logoUrl = edu.logoUrl
  educationFormState.websiteUrl = edu.websiteUrl ?? ''
  educationFormState.startDate = edu.startDate
  educationFormState.endDate = edu.endDate ?? null

  const rawStart = new Date(edu.startDate)
  eduStartDate.value = new CalendarDate(rawStart.getFullYear(), rawStart.getMonth() + 1, rawStart.getDate())

  const rawEnd = edu.endDate ? new Date(edu.endDate) : null
  eduEndDate.value = rawEnd ? new CalendarDate(rawEnd.getFullYear(), rawEnd.getMonth() + 1, rawEnd.getDate()) : null

  schoolProjectsForm.value = (edu.schoolProjects as SchoolProject[]).map(p => ({
    ...p,
    tagsRaw: p.tags.join(', '),
  }))

  educationModalOpen.value = true
}

async function handleDeleteEducation(id: number) {
  if (!confirm('Delete this education entry?')) return
  try {
    await $fetch(`/api/education/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Deleted', color: 'success', icon: Icons.ui.success })
    await refreshEducation()
  }
  catch {
    toast.add({ title: 'Error', color: 'error', icon: Icons.ui.error })
  }
}

// ─── Certifications ───────────────────────────────────────────────────────────

const certModalOpen = ref(false)
const { data: certifications, status: certStatus, refresh: refreshCerts } = await useFetch('/api/certifications', { method: 'GET' })

const certSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issuerUrl: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  issuedAt: z.string().min(1, 'Issue date is required'),
  expiresAt: z.string().nullable().optional(),
  credentialUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})

type CertFormData = z.infer<typeof certSchema>

const certIssuedDate = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
const certExpiresDate = shallowRef<CalendarDate | null>(null)

watch(certIssuedDate, (v) => {
  certFormState.issuedAt = v.toDate(getLocalTimeZone()).toISOString()
})
watch(certExpiresDate, (v) => {
  certFormState.expiresAt = v ? v.toDate(getLocalTimeZone()).toISOString() : null
})

const certFormState = reactive<CertFormData>({
  name: '',
  issuer: '',
  issuerUrl: '',
  logoUrl: '',
  issuedAt: certIssuedDate.value.toDate(getLocalTimeZone()).toISOString(),
  expiresAt: null,
  credentialUrl: '',
  description: '',
})

const isEditingCert = computed(() => certFormState.id !== undefined)

function resetCertForm() {
  certFormState.id = undefined
  certFormState.name = ''
  certFormState.issuer = ''
  certFormState.issuerUrl = ''
  certFormState.logoUrl = ''
  certFormState.issuedAt = certIssuedDate.value.toDate(getLocalTimeZone()).toISOString()
  certFormState.expiresAt = null
  certFormState.credentialUrl = ''
  certFormState.description = ''
  certIssuedDate.value = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  certExpiresDate.value = null
}

async function handleCertSubmit(event: FormSubmitEvent<CertFormData>) {
  try {
    if (isEditingCert.value) {
      await $fetch(`/api/certifications/${certFormState.id}`, { method: 'PATCH', body: event.data })
      toast.add({ title: 'Saved', color: 'success', icon: Icons.ui.success })
    }
    else {
      await $fetch('/api/certifications', { method: 'POST', body: event.data })
      toast.add({ title: 'Created', color: 'success', icon: Icons.ui.success })
    }
    certModalOpen.value = false
    await refreshCerts()
  }
  catch {
    toast.add({ title: 'Error', color: 'error', icon: Icons.ui.error })
  }
}

function handleEditCert(id: number) {
  const cert = certifications.value?.find(c => c.id === id)
  if (!cert) return

  certFormState.id = id
  certFormState.name = cert.name
  certFormState.issuer = cert.issuer
  certFormState.issuerUrl = cert.issuerUrl ?? ''
  certFormState.logoUrl = cert.logoUrl ?? ''
  certFormState.issuedAt = cert.issuedAt
  certFormState.expiresAt = cert.expiresAt ?? null
  certFormState.credentialUrl = cert.credentialUrl ?? ''
  certFormState.description = cert.description ?? ''

  const rawIssued = new Date(cert.issuedAt)
  certIssuedDate.value = new CalendarDate(rawIssued.getFullYear(), rawIssued.getMonth() + 1, rawIssued.getDate())

  const rawExpires = cert.expiresAt ? new Date(cert.expiresAt) : null
  certExpiresDate.value = rawExpires ? new CalendarDate(rawExpires.getFullYear(), rawExpires.getMonth() + 1, rawExpires.getDate()) : null

  certModalOpen.value = true
}

async function handleDeleteCert(id: number) {
  if (!confirm('Delete this certification?')) return
  try {
    await $fetch(`/api/certifications/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Deleted', color: 'success', icon: Icons.ui.success })
    await refreshCerts()
  }
  catch {
    toast.add({ title: 'Error', color: 'error', icon: Icons.ui.error })
  }
}
</script>
