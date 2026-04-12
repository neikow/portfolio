export type TextBlock = {
  type: 'text'
  label: string
  content: string
}

export type UrlBlock = {
  type: 'url'
  label: string
  url: string
  fetchedContent: string
}

export type FileBlock = {
  type: 'file'
  label: string
  fileUrl: string
  fileName: string
}

export type InputBlock = TextBlock | UrlBlock | FileBlock

export function buildInputContentFromBlocks(blocks: InputBlock[]): string {
  return blocks.map((block) => {
    if (block.type === 'text') return `## ${block.label}\n${block.content}`
    if (block.type === 'url') return `## ${block.label} (${block.url})\n${block.fetchedContent || '(not fetched)'}`
    if (block.type === 'file') return `## ${block.label}\n[Attached file: ${block.fileName} at ${block.fileUrl}]`
    return ''
  }).filter(Boolean).join('\n\n')
}
