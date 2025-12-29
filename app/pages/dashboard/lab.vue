<template>
  <div>
    <DashboardHeader>
      <template #title>
        Lab Experiments
      </template>

      <template #actions>
        <UModal
          v-model:open="labModalOpen"
          :ui="{ content: 'max-w-4xl' }"
        >
          <UButton
            :icon="Icons.actions.add"
            @click="resetLabForm"
          >
            New Experiment
          </UButton>

          <template #title>
            <h2 class="font-black text-2xl">
              {{ isEditing ? "Editing Experiment" : "New Lab Experiment" }}
            </h2>
          </template>

          <template #body>
            <UForm
              :schema="labExperimentInsertSchema"
              :state="labFormState"
              @submit="handleLabSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 md:gap-6">
                <div class="flex flex-col gap-4 w-full">
                  <UFormField
                    label="Experiment Name"
                    name="name"
                  >
                    <UInput
                      v-model="labFormState.name"
                      class="w-full"
                      placeholder="e.g. AI Image Generator"
                      required
                    />
                  </UFormField>

                  <UFormField
                    label="Description"
                    name="description"
                  >
                    <UTextarea
                      v-model="labFormState.description"
                      :rows="4"
                      class="w-full"
                      placeholder="What is this experiment about?"
                      required
                    />
                  </UFormField>

                  <UFormField
                    label="Live URL"
                    name="url"
                  >
                    <UInput
                      v-model="labFormState.url"
                      class="w-full"
                      placeholder="https://lab.lysen.dev/demo"
                    />
                  </UFormField>
                  <UFormField
                    label="Repository URL"
                    name="repoUrl"
                  >
                    <UInput
                      v-model="labFormState.repoUrl"
                      class="w-full"
                      placeholder="https://github.com/..."
                    />
                  </UFormField>

                  <UFormField
                    label="Tags (comma separated)"
                    name="tags"
                  >
                    <UInput
                      :model-value="labFormState.tags?.join(', ')"
                      class="w-full"
                      placeholder="vue, typescript, ai"
                      @update:model-value="val => labFormState.tags = val.split(',').map(s => s.trim()).filter(Boolean)"
                    />
                  </UFormField>
                </div>

                <UFormField
                  label="Pictures"
                  name="pictures"
                >
                  <ImagesEditorInput v-model:images="labFormState.pictures" />
                </UFormField>
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <UButton
                  color="neutral"
                  variant="ghost"
                  @click="labModalOpen = false"
                >
                  Cancel
                </UButton>
                <UButton
                  color="primary"
                  type="submit"
                >
                  {{ isEditing ? 'Update' : 'Create' }}
                </UButton>
              </div>
            </UForm>
          </template>
        </UModal>
      </template>
    </DashboardHeader>

    <div class="p-4">
      <div v-if="experiments?.length === 0">
        <EmptyState
          :icon="Icons.projects.icon"
          description="Ready to showcase your R&D? Add your first lab experiment."
          title="No experiments found"
        />
      </div>

      <div v-else-if="status === 'pending'">
        Loading experiments...
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="lab in experiments"
          :key="lab.id"
          class="border border-default rounded-lg p-4 bg-default shadow-sm flex flex-col justify-between"
        >
          <div>
            <div>
              <img
                v-if="lab.pictures && lab.pictures.length > 0"
                :alt="`Picture for ${lab.name}`"
                :src="lab.pictures[0]"
                class="w-full h-24 md:h-32 lg:h-48 object-cover rounded-md mb-4"
              >
            </div>

            <h3 class="font-bold text-lg">
              {{ lab.name }}
            </h3>

            <p class="text-sm text-muted line-clamp-2 mb-2">
              {{ lab.description }}
            </p>

            <div class="mt-2 flex gap-2 flex-wrap">
              <UButton
                v-if="lab.url"
                :href="lab.url"
                :icon="Icons.ui.externalLink"
                size="xs"
                target="_blank"
              >
                Live Demo
              </UButton>
              <UButton
                v-if="lab.repoUrl"
                :href="lab.repoUrl"
                :icon="Icons.socials.github"
                size="xs"
                target="_blank"
              >
                Repository
              </UButton>
            </div>

            <div class="flex flex-wrap gap-1 mt-2">
              <UBadge
                v-for="tag in lab.tags"
                :key="tag"
                size="sm"
                variant="soft"
              >
                {{ tag }}
              </UBadge>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-t-default">
            <UButton
              :icon="Icons.actions.edit"
              size="xs"
              variant="ghost"
              @click="handleEdit(lab)"
            />
            <UButton
              :icon="Icons.actions.delete"
              color="error"
              size="xs"
              variant="ghost"
              @click="handleDelete(lab.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icons } from '#shared/consts/icons'
import { type LabExperiment, type LabExperimentInsert, labExperimentInsertSchema } from '#shared/schemas/labExperiment'
import ImagesEditorInput from '~/components/ImagesEditorInput.vue'

useHead({ title: 'Lab Experiments - lysen.dev' })

const toast = useToast()
const labModalOpen = ref(
  new URL(window.location.href).searchParams.has('new') || false,
)

type CompleteLabExperiment = LabExperimentInsert & {
  id?: LabExperiment['id']
  pictures: LabExperiment['pictures']
}

const EMPTY_LAB: CompleteLabExperiment = {
  name: '',
  description: '',
  url: '',
  repoUrl: '',
  pictures: [],
  tags: [],
}

const labFormState = reactive<CompleteLabExperiment>({ ...EMPTY_LAB })
const isEditing = computed(() => !!labFormState.id)

const { data: experiments, status, refresh } = await useFetch<LabExperiment[]>('/api/lab')

function resetLabForm() {
  Object.assign(labFormState, EMPTY_LAB)
  delete labFormState.id
  labModalOpen.value = true
}

function handleEdit(lab: LabExperiment) {
  Object.assign(labFormState, lab)
  labModalOpen.value = true
}

async function handleLabSubmit() {
  const method = isEditing.value ? 'PATCH' : 'POST'
  const url = isEditing.value ? `/api/lab/${labFormState.id}` : '/api/lab'

  try {
    await $fetch(url, {
      method,
      body: labFormState,
    })
    toast.add({ title: 'Success', color: 'success', icon: Icons.ui.success })
    labModalOpen.value = false
    refresh()
  }
  catch (e) {
    console.error(e)
    toast.add({ title: 'Error', color: 'error', icon: Icons.ui.error })
  }
}

async function handleDelete(id: number) {
  if (!confirm('Delete this experiment?')) return
  try {
    await $fetch(`/api/lab-experiments/${id}`, { method: 'DELETE' })
    refresh()
  }
  catch (e) {
    console.error(e)
    toast.add({ title: 'Error deleting', color: 'error' })
  }
}

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
})
</script>
