import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './shared/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NUXT_DB_URL!,
  },
})
