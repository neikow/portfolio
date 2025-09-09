<template>
  <div />
  <EditorContent
    :editor="editor"
    class="prose prose-neutral dark:prose-invert mx-auto active:outline-none"
  />
</template>

<script lang="ts" setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { Document } from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import Image from '@tiptap/extension-image'
import Focus from '@tiptap/extension-focus'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'

import FileHandler from '@tiptap/extension-file-handler'

const value = defineModel<string>()

const emit = defineEmits<{
  (e: 'input', value: string): void
}>()

async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return await $fetch('/api/blog/upload-media', {
    method: 'POST',
    body: formData,
  })
}

const editor = useEditor({
  content: value.value,
  extensions: [
    Document,
    Heading,
    Paragraph,
    Text,
    Code,
    CodeBlock,
    HardBreak,
    Focus.configure({
      className: 'prose-img:ring ring-primary',
      mode: 'all',
    }),
    Image.configure({
      inline: true,
      HTMLAttributes: {
        class: 'rounded-md mx-auto border-none shadow-sm',
      },
    }),
    FileHandler.configure({
      onDrop: (currentEditor, files, pos) => {
        files.forEach(async (file) => {
          const { href } = await uploadFile(file)

          currentEditor
            .chain()
            .insertContentAt(pos, {
              type: 'image',
              attrs: {
                src: href,
              },
            })
            .focus()
            .run()
        })
      },
      onPaste: (currentEditor, files, htmlContent) => {
        files.forEach(async (file) => {
          if (htmlContent) {
            return false
          }

          const { href } = await uploadFile(file)

          currentEditor
            .chain()
            .insertContentAt(currentEditor.state.selection.anchor, {
              type: 'image',
              attrs: {
                src: href,
              },
            })
            .focus()
            .run()
        })
      },
    }),
  ],
  onUpdate: () => {
    if (!editor.value) {
      return
    }
    emit('input', editor.value.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'prose prose-neutral dark:prose-invert prose-sm sm:prose lg:prose-lg mx-auto px-4 py-4 focus:outline-none',
    },
  },
})

watch(value, (newValue) => {
  const isSame = editor.value?.getHTML() === newValue

  if (isSame) {
    return
  }

  editor.value?.commands.setContent(newValue ?? '', { emitUpdate: false })
})
</script>
