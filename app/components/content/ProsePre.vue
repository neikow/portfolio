<template>
  <div class="max-w-fit min-w-lg mx-auto rounded-lg bg-zinc-900 shadow-lg mb-8">
    <div
      v-if="$props.filename"
      class="font-mono text-sm border bg-inverted flex items-center justify-start
             border-slate-300 py-2 px-12 rounded-t-md text-inverted"
    >
      <div class="flex flex-1">
        <UIcon
          class="mr-2 text-inverted"
          name="i-lucide-file"
          size="16"
        />

        {{ $props.filename }}
      </div>
      <button
        aria-label="Copy code to clipboard"
        class="flex items-center justify-center h-8 w-8 rounded hover:bg-default/10 transition-colors"
        @click="copyCode"
      >
        <UIcon
          :name="copyIcon"
          class="text-inverted"
          size="16"
        />
      </button>
    </div>
    <div
      v-else
      class="relative w-full"
    >
      <button
        aria-label="Copy code to clipboard"
        class="flex items-center right-12 top-2 absolute justify-center h-8 w-8 rounded hover:bg-inverted/10 transition-colors"
        @click="copyCode"
      >
        <UIcon
          :name="copyIcon"
          class="fill-inverted"
          size="16"
        />
      </button>
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
