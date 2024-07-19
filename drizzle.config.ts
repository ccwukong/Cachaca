import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

if (!process.env.DB_HOST) {
  dotenv.config()
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    port: Number(process.env.DB_PORT!),
    ssl: {
      ca: process.env.DB_SSL_CA || '',
      rejectUnauthorized: false,
    },
  },
})
