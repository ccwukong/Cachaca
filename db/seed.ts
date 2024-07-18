import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { currency } from './schema'
import seeddata from './seeddata.json'
dotenv.config()
;(async () => {
  const connection = await mysql.createConnection(
    `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  )
  const db = drizzle(connection)

  console.log('Seeding start')
  const res = await db.select().from(currency)

  if (!res.length) {
    for (const itm of seeddata.currencies) {
      const { id, code, symbol, name } = itm
      await db.insert(currency).values({ id, code, symbol, name, status: 1 })
    }
    console.log('Seeding done')
  } else {
    console.log('Already seeded')
  }

  process.exit(0)
})()
