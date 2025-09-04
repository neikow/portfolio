<template>
  <div class="max-w-fit min-w-lg mx-auto rounded-lg bg-default shadow-lg dark:shadow-2xl mb-8">
    <div
      v-if="$props.filename"
      class="font-mono text-sm border bg-default flex items-center justify-start
             border-default py-2 px-12 rounded-t-md"
    >
      <div class="flex flex-1">
        <UIcon
          class="mr-2"
          name="i-lucide-file"
          size="16"
        />

        {{ $props.filename }}
      </div>
      <UButton
        :icon="copyIcon"
        aria-label="Copy code to clipboard"
        class="cursor-pointer"
        variant="ghost"
        @click="copyCode"
      />
    </div>
    <div
      v-else
      class="relative w-full"
    >
      <UButton
        :icon="copyIcon"
        aria-label="Copy code to clipboard"
        class="top-5 right-5 absolute cursor-pointer"
        variant="ghost"
        @click="copyCode"
      />
    </div>
    <pre
      :class="{
        [$props.class as string]: true,
        'mt-0 rounded-t-none pt-6': $props.filename,
        'pt-12': !$props.filename,
        'px-12 pb-12': true,
      }"
    ><slot /></pre>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})

const toast = useToast()

const copyIcon = ref('i-lucide-copy')

function copyCode() {
  const code = props.code || ''

  copyIcon.value = 'i-lucide-check'
  setTimeout(() => {
    copyIcon.value = 'i-lucide-copy'
  }, 1000)

  if (!navigator.clipboard) {
    toast.add({
      color: 'error',
      title: 'Clipboard not supported',
      icon: 'i-lucide-x',
      description: 'Your browser does not support the Clipboard API. Please copy the code manually.',
    })
    return
  }
  navigator.clipboard.writeText(code).then(() => {
    toast.add({
      color: 'success',
      title: 'Code copied!',
      icon: 'i-lucide-check',
      description: 'The code has been copied to your clipboard.',
      duration: 1000,
    })
  }).catch(() => {
    toast.add({
      color: 'error',
      title: 'Failed to copy code',
      icon: 'i-lucide-x',
      description: 'An error occurred while trying to copy the code. Please try again.',
    })
  })
}
</script>

<style>
pre code .line {
  display: block;
}

pre {
  counter-reset: line-number;
}

pre code .line {
  counter-increment: line-number;
}

pre code .line:before {
  content: counter(line-number);
  display: inline-block;
  width: 2em;
  text-align: right;
  padding-right: 4em;
  color: var(--color-secondary);
  opacity: 50%;
}
</style>
