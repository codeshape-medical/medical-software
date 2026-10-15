// import 'dotenv/config'
// import pg from 'pg'

// const { Pool } = pg

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// })

// pool.on('error', (error) => console.error('PostgreSQL pool error:', error))

// export async function query(text, params = []) {
//   return pool.query(text, params)
// }
import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
})

pool.on('error', (error) => console.error('PostgreSQL pool error:', error))

export async function query(text, params = []) {
  return pool.query(text, params)
}