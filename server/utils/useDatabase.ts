import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'

export function useDatabase() {
  return drizzle(process.env.NUXT_DB_FILE_NAME!)
}
