import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

const connection = mysql.createPool(process.env.CONNECTION_STRING!)
const db = drizzle(connection)

export default db
