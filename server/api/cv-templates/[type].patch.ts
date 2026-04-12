import { z } from 'zod'
import { cvTemplatesTable } from '#shared/schemas/cvTemplate'

const schema = z.object({ html: z.string().min(1) })

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const type = getRouterParam(event, 'type')
  if (type !== 'eu' && type !== 'us') throw createError({ statusCode: 400, statusMessage: 'type must be eu or us' })

  const body = await readBody(event)
  const { success, data } = schema.safeParse(body)
  if (!success) throw createError({ statusCode: 400 })

  const db = useDatabase()

  await db.insert(cvTemplatesTable)
    .values({ type, html: data.html })
    .onConflictDoUpdate({ target: cvTemplatesTable.type, set: { html: data.html, updatedAt: new Date().toISOString() } })

  return { success: true }
})
