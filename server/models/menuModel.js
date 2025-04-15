import { db } from '../db/connection-turso.js'
import { menuSchema, partialMenuSchema } from '../schemas/menu.js'
import { randomUUID } from 'crypto'

export class MenuModel {
  static async getAll ({ categoryId }) {
    let query = `SELECT * FROM menu
                 JOIN categories ON menu.category_id = categories.categories_id`
    const params = []

    if (categoryId) {
      query += ' WHERE menu.category_id = ?'
      params.push(categoryId)
    }

    const { rows } = await db.execute(query, params)
    return rows
  }

  static async getById ({ id }) {
    const { rows } = await db.execute(
      'SELECT * FROM menu WHERE product_id = ?',
      [id]
    )

    if (rows.length === 0) return null

    return rows[0]
  }

  static async create ({ input }) {
    const validated = menuSchema.parse(input)

    const newProduct = {
      product_id: randomUUID(),
      product_name: validated.product_name,
      product_price: validated.product_price,
      product_image: validated.product_image,
      product_description: validated.product_description,
      category_id: validated.category_id
    }

    await db.execute(
      `INSERT INTO menu (
        product_id, product_name, product_description,
        product_price, product_image, category_id
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newProduct.product_id,
        newProduct.product_name,
        newProduct.product_description,
        newProduct.product_price,
        newProduct.product_image,
        newProduct.category_id
      ]
    )

    return newProduct
  }

  static async delete ({ id }) {
    const result = await db.execute(
      'DELETE FROM menu WHERE product_id = ?',
      [id]
    )

    return result.rowsAffected > 0
  }

  static async update ({ id, input }) {
    const validated = partialMenuSchema.parse(input)

    const updates = []
    const values = []

    for (const key in validated) {
      updates.push(`${key} = ?`)
      values.push(validated[key])
    }

    if (updates.length === 0) return null

    values.push(id) // Para el WHERE

    const query = `UPDATE menu SET ${updates.join(', ')} WHERE product_id = ?`
    await db.execute(query, values)

    return this.getById({ id }) // Devolvemos el producto actualizado
  }
}
