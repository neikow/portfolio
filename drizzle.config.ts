import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './server/schemas',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.NUXT_DB_FILE_NAME!,
  },
})
