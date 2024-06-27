import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import md5 from 'md5'
import { currency, shopCategory, user } from './schema'
import { makeStr } from '../app/utils/string'
import seeddata from './seeddata.json'
dotenv.config()
;(async () => {
  const connection = await mysql.createConnection(
    `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  )
  const db = drizzle(connection)

  console.log('Seeding start')

  for (const itm of seeddata.currencies) {
    const { id, code, symbol, name } = itm
    await db.insert(currency).values({ id, code, symbol, name, status: 1 })
  }

  for (const itm of seeddata.shopCategories) {
    await db.insert(shopCategory).values({
      name: itm,
      status: 1,
      createdOn: Math.floor(Date.now() / 1000),
    })
  }
  const salt = makeStr(8)
  await db.insert(user).values({
    id: uuidv4(),
    email: seeddata.superAdmin.email,
    phone: seeddata.superAdmin.phone,
    firstName: seeddata.superAdmin.firstName,
    lastName: seeddata.superAdmin.lastName,
    password: md5(seeddata.superAdmin.password + salt),
    salt,
    avatar: '',
    createdOn: Math.floor(Date.now() / 1000),
    status: 1,
  })

  console.log('Seeding done')
  process.exit(0)
})()
