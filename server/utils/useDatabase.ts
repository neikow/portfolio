import { drizzle } from 'drizzle-orm/node-postgres'

export function useDatabase() {
  const { dbUrl } = useRuntimeConfig()

  return drizzle(dbUrl)
}
