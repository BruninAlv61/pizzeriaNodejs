import { db } from './connection-turso.js'

await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
        categories_id TEXT PRIMARY KEY,
        category_name TEXT NOT NULL,
        category_description TEXT NOT NULL,
        category_image TEXT NOT NULL   
    )
`)
