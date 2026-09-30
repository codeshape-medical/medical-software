import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { query, pool } from './db.js'

const passwordHash = await bcrypt.hash('admin123', 12)
await query(
  `INSERT INTO users (name, username, password_hash, role)
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (username) DO UPDATE
   SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
  ['Store Admin', 'admin', passwordHash, 'Admin']
)
console.log('Admin user ready: admin / admin123')
await pool.end()
