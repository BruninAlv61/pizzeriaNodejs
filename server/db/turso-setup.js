import { db } from './connection-turso.js'

await db.execute(`
  CREATE TABLE IF NOT EXISTS categories (
    categories_id TEXT PRIMARY KEY,
    category_name TEXT NOT NULL,
    category_description TEXT NOT NULL,
    category_image TEXT NOT NULL
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS menu (
    product_id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    product_description TEXT NOT NULL,
    product_price REAL NOT NULL,
    product_image TEXT NOT NULL,
    category_id TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(categories_id)
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS branches (
    branch_id TEXT PRIMARY KEY,
    province TEXT NOT NULL,
    locality TEXT NOT NULL,
    address TEXT NOT NULL,
    phone_number TEXT NOT NULL
  )
`)
