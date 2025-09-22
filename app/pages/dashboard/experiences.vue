<template>
  <div>
    <DashboardHeader>
      <template #title>
        Work Experiences
      </template>

      <template #actions>
        <UModal
          v-model:open="experienceModalOpen"
        >
          <UButton
            :icon="Icons.actions.add"
            @click="resetExperienceForm"
          >
            Add Experience
          </UButton>

          <template #title>
            <h2 class="font-black text-2xl">
              {{ isEditing ? "Editing Experience" : "New Experience" }}
            </h2>
          </template>

          <template #body>
            <UForm
              :schema="experienceSchema"
              :state="experienceFormState"
              @error="console.log($event)"
              @submit="handleExperienceSubmit"
            >
              <div class="flex flex-col gap-2">
                <UFormField
                  label="Experience Name"
                  name="name"
                >
                  <UInput
                    v-model="experienceFormState.name"
                    class="w-full"
                    placeholder="e.g. Software Engineer at XYZ"
                    required
                  />
                </UFormField>

                <UFormField
                  label="Role"
                  name="role"
                >
                  <UInput
                    v-model="experienceFormState.role"
                    class="w-full"
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </UFormField>

                <UFormField
                  label="Description"
                  name="description"
                >
                  <UTextarea
                    v-model="experienceFormState.description"
                    :rows="4"
                    class="w-full"
                    placeholder="Describe your experience..."
                    required
                  />
                </UFormField>

                <div class="my-2" />

                <UFormField
                  class="flex-1"
                  label="Company Name"
                  name="company"
                >
                  <UInput
                    v-model="experienceFormState.company"
                    class="w-full"
                    placeholder="e.g. XYZ Corp"
                    required
                  />
                </UFormField>

                <UFormField
                  label="Company Website"
                  name="companyUrl"
                >
                  <UInput
                    v-model="experienceFormState.companyUrl"
                    class="w-full"
                    placeholder="https://company.com"
                  />
                </UFormField>

                <UFormField
                  label="Company Logo"
                  name="logoUrl"
                >
                  <UInput
                    v-model="experienceFormState.logoUrl"
                    class="w-full"
                    placeholder="https://cdn.company.com/favicon.svg"
                  />
                </UFormField>

                <div class="my-2" />

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
                        {{
                          startDate ? df.format(startDate.toDate(getLocalTimeZone())) : 'Select a date'
                        }}
                      </UButton>

                      <template #content>
                        <UCalendar
                          v-model="startDate"
                          class="p-2"
                        />
                      </template>
                    </UPopover>
                  </UFormField>

                  <UFormField
                    class="flex-1"
                    label="Start Date"
                    name="startDate"
                  >
                    <UPopover>
                      <div class="flex gap-1">
                        <UButton
                          :icon="Icons.ui.calendar"
                          class="w-full"
                          color="neutral"
                          variant="subtle"
                        >
                          {{
                            endDate ? df.format(endDate.toDate(getLocalTimeZone())) : 'Select a date'
                          }}
                        </UButton>
                        <UButton
                          :icon="Icons.actions.delete"
                          color="neutral"
                          variant="subtle"
                          @click="endDate = null"
                        />
                      </div>

                      <template #content>
                        <UCalendar
                          v-model="endDate"
                          class="p-2"
                        />
                      </template>
                    </UPopover>
                  </UFormField>
                </div>

                <div class="flex flex-row justify-end w-full gap-2 mt-8">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    @click="experienceModalOpen = false"
                  >
                    Cancel
                  </UButton>
                  <UButton
                    :icon="isEditing ? Icons.actions.edit : Icons.actions.add"
                    color="primary"
                    type="submit"
                  >
                    {{ isEditing ? 'Edit' : 'Create' }}
                  </UButton>
                </div>
              </div>
            </UForm>
          </template>
        </UModal>
      </template>
    </DashboardHeader>

    <div class="my-4 mx-4">
      <div v-if="experiences && experiences.length === 0">
        <EmptyState
          :icon="Icons.projects.icon"
          description="You haven't added any work experiences yet. Click the button above to add your first experience."
          title="No experiences yet"
        />
      </div>
      <div v-else-if="status === 'pending'">
        <div>Loading...</div>
      </div>
      <div
        v-else-if="experiences"
        class="flex flex-col gap-2"
      >
        <DashboardExperienceCard
          v-for="experience in experiences"
          :key="experience.id"
          :experience="experience"
          @delete="handleDelete"
          @edit="handleEdit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import DashboardHeader from '~/components/DashboardHeader.vue'
import DashboardExperienceCard from '~/components/DashboardExperienceCard.vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { ExperienceInsert } from '#shared/schemas/experience'

useHead({
  title: 'Manage Experiences - lysen.dev',
})

const toast = useToast()
const experienceModalOpen = ref(false)

const experienceSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  companyUrl: z.string().nullable().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  description: z.string().min(1, 'Description is required'),
  logoUrl: z.string(),
})

const today = new Date()

const startDate = shallowRef(new CalendarDate(
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate(),
))
const endDate = shallowRef<CalendarDate | null>(null)

const EMPTY_EXPERIENCE: NewExperienceFormData = import.meta.dev
  ? {
      name: 'Full-Stack Software Engineer at HelloWatt',
      role: 'Full-Stack Software Engineer',
      company: 'HelloWatt',
      companyUrl: 'https://hellowatt.fr',
      startDate: startDate.value.toDate(getLocalTimeZone()).toISOString(),
      endDate: endDate.value ? endDate.value.toDate(getLocalTimeZone()).toISOString() : undefined,
      description: 'Worked on developing and maintaining web applications using React and Django frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions.',
      logoUrl: 'https://cdn.hellowatt.fr/static/img/favicon/hellowatt-favicon.svg',
    }
  : {
      name: '',
      role: '',
      company: '',
      startDate: startDate.value.toDate(getLocalTimeZone()).toISOString(),
      endDate: undefined,
      description: '',
      logoUrl: '',
    }

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

type NewExperienceFormData = z.infer<typeof experienceSchema>

const experienceFormState = reactive<NewExperienceFormData>({ ...EMPTY_EXPERIENCE })

function resetExperienceForm() {
  Object.assign(
    experienceFormState,
    EMPTY_EXPERIENCE,
  )
  startDate.value = new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  )
  endDate.value = null
}

const isEditing = computed(() => experienceFormState.id !== undefined)

watch(startDate, (newVal) => {
  experienceFormState.startDate = newVal.toDate(getLocalTimeZone()).toISOString()
})

watch(endDate, (newValue) => {
  experienceFormState.endDate = newValue ? newValue.toDate(getLocalTimeZone()).toISOString() : undefined
})

const { data: experiences, status, refresh } = await useFetch('/api/experiences', {
  method: 'GET',
})

function postNewExperience(data: ExperienceInsert) {
  return $fetch('/api/experiences', {
    method: 'POST',
    body: {
      ...data,
    },
  })
}

async function handleCreateExperience(data: NewExperienceFormData) {
  try {
    await postNewExperience(data)
    toast.add({
      title: 'Success',
      description: 'Experience created successfully!',
      color: 'success',
      icon: Icons.ui.success,
    })
    experienceModalOpen.value = false
    await refresh()
  }
  catch (e) {
    console.error(e)
    toast.add({
      title: 'Error',
      description: 'Failed to create experience. Please try again.',
      color: 'error',
      icon: Icons.ui.error,
    })
  }
}

async function handleUpdateExperience(id: number, data: NewExperienceFormData) {
  try {
    await $fetch(`/api/experiences/${id}`, {
      method: 'PATCH',
      body: {
        ...data,
      },
    })
    toast.add({
      title: 'Success',
      description: 'Experience updated successfully!',
      color: 'success',
      icon: Icons.ui.success,
    })
    experienceModalOpen.value = false
    await refresh()
  }
  catch (e) {
    console.error(e)
    toast.add({
      title: 'Error',
      description: 'Failed to update experience. Please try again.',
      color: 'error',
      icon: Icons.ui.error,
    })
  }
}

async function handleExperienceSubmit(event: FormSubmitEvent<NewExperienceFormData>) {
  if (isEditing.value) {
    await handleUpdateExperience(event.data.id!, event.data)
  }
  else {
    await handleCreateExperience(event.data)
  }
}

function handleEdit(id: number) {
  const experience = experiences.value?.find(exp => exp.id === id)
  if (!experience) {
    toast.add({
      title: 'Error',
      description: 'Experience not found.',
      color: 'error',
      icon: Icons.ui.error,
    })
    return
  }

  experienceFormState.id = id
  experienceModalOpen.value = true
  Object.assign(
    experienceFormState,
    experience,
  )

  const rawStartDate = new Date(experience.startDate)
  startDate.value = new CalendarDate(
    rawStartDate.getFullYear(),
    rawStartDate.getMonth() + 1,
    rawStartDate.getDate(),
  )

  const rawEndDate = experience.endDate ? new Date(experience.endDate) : null
  endDate.value = rawEndDate
    ? new CalendarDate(
      rawEndDate.getFullYear(),
      rawEndDate.getMonth() + 1,
      rawEndDate.getDate(),
    )
    : null
}

async function handleDelete(id: number) {
  if (!confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
    return
  }

  try {
    await $fetch(`/api/experiences/${id}`, {
      method: 'DELETE',
    })
    toast.add({
      title: 'Success',
      description: 'Experience deleted successfully!',
      color: 'success',
      icon: Icons.ui.success,
    })
    await refresh()
  }
  catch (e) {
    console.error(e)
    toast.add({
      title: 'Error',
      description: 'Failed to delete experience. Please try again.',
      color: 'error',
      icon: Icons.ui.error,
    })
  }
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})
</script>
