import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'

export function useDatabase() {
  return drizzle(process.env.NUXT_DB_URL!)
}
