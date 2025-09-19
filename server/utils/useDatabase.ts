import { drizzle } from 'drizzle-orm/node-postgres'

export function useDatabase() {
  const { dbUrl } = useRuntimeConfig()

  console.log({ dbUrl })

  return drizzle(dbUrl)
}
