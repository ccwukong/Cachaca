import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

const connection = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT!),
  ssl: {
    ca: process.env.DB_SSL_CA || '',
    rejectUnauthorized: false,
  },
})
const db = drizzle(connection)

export default db
