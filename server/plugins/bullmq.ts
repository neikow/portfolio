import { Worker } from 'bullmq'

let generationWorker: Worker | null = null
let pdfWorker: Worker | null = null

export default defineNitroPlugin((nitroApp) => {
  try {
    generationWorker = new Worker('generation', async (job) => {
      const { acquisitionId } = job.data
      await generateAcquisition(acquisitionId)
    }, { connection: createRedisConnection(), concurrency: 2 })

    pdfWorker = new Worker('pdf', async (job) => {
      const { acquisitionId, templateType } = job.data
      await generateAcquisitionPdf(acquisitionId, templateType)
    }, { connection: createRedisConnection(), concurrency: 1 })

    generationWorker.on('failed', (job, err) => {
      console.error(`[bullmq] generation job ${job?.id} failed:`, err.message)
    })

    pdfWorker.on('failed', (job, err) => {
      console.error(`[bullmq] pdf job ${job?.id} failed:`, err.message)
    })

    console.log('[bullmq] workers started')
  }
  catch (err) {
    console.error('[bullmq] failed to start workers:', err)
  }

  nitroApp.hooks.hook('close', async () => {
    await generationWorker?.close()
    await pdfWorker?.close()
  })
})
