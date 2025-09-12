import { experiencesTable } from '#shared/schemas/experience'

export default defineEventHandler(async () => {
  const db = useDatabase()

  return db.select().from(experiencesTable).orderBy(
    experiencesTable.startDate,
    experiencesTable.endDate,
  )
})
