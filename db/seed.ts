import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { currency } from './schema'
import seeddata from './seeddata.json'
;(async () => {
  const connection = await mysql.createConnection({
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
