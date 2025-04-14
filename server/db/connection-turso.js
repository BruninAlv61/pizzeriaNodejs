import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config()

export const db = createClient({
  url: 'libsql://pizzeria-brunindevv.turso.io',
  authToken: process.env.DB_TOKEN
})
