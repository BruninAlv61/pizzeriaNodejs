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

await db.execute(`
  CREATE TABLE IF NOT EXISTS combo_offers (
    combo_offers_id TEXT PRIMARY KEY,
    combo_offers_name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    combo_offers_image TEXT NOT NULL
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS combo_offer_menu (
    combo_offer_menu_id TEXT PRIMARY KEY,
    combo_offers_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (combo_offers_id) REFERENCES combo_offers(combo_offers_id),
    FOREIGN KEY (product_id) REFERENCES menu(product_id)
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS admin (
    admin_id    TEXT PRIMARY KEY,
    admin_name  TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL 
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS customers (
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    branch_id TEXT NOT NULL,
    total_price REAL NOT NULL,
    order_status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS physical_sales (
    physical_sales_id TEXT PRIMARY KEY,
    customer_id TEXT,
    sale_date TEXT NOT NULL,
    total_price REAL NOT NULL,
    payment_method TEXT NOT NULL,
    customer_phone TEXT,
    branch_id TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
  )
`)

await db.execute(`
  CREATE TABLE IF NOT EXISTS sales_items (
    sales_item_id TEXT PRIMARY KEY,
    physical_sale_id TEXT,
    order_id TEXT,
    product_id TEXT,
    combo_offers_id TEXT,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (physical_sale_id) REFERENCES physical_sales(physical_sales_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES menu(product_id),
    FOREIGN KEY (combo_offers_id) REFERENCES combo_offers(combo_offers_id)
  )
`)
