import { Queue } from 'bullmq'

let _generationQueue: Queue | null = null
let _pdfQueue: Queue | null = null

export function useGenerationQueue(): Queue {
  if (!_generationQueue) {
    _generationQueue = new Queue('generation', { connection: createRedisConnection() })
  }
  return _generationQueue
}

export function usePdfQueue(): Queue {
  if (!_pdfQueue) {
    _pdfQueue = new Queue('pdf', { connection: createRedisConnection() })
  }
  return _pdfQueue
}
