import Anthropic from '@anthropic-ai/sdk'

let _client: Anthropic | null = null

export function useAnthropicClient(): Anthropic {
  if (!_client) {
    const { anthropicApiKey } = useRuntimeConfig()
    _client = new Anthropic({ apiKey: anthropicApiKey })
  }
  return _client
}
