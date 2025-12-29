import { labExperimentsTable } from '#shared/schemas/labExperiment'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDatabase()

  return db.select().from(labExperimentsTable).orderBy(desc(labExperimentsTable.editedAt))
})
