import { randomUUID } from 'node:crypto'
import { db } from '../db/connection-turso.js'

export class ComboOffersModel {
  static async getAll () {
    const result = await db.execute('SELECT * FROM combo_offers')
    return result.rows // El resultado de la consulta estará en `rows`
  }

  static async getById ({ id }) {
    const result = await db.execute('SELECT * FROM combo_offers WHERE combo_offers_id = ?', [id])
    const comboOffer = result.rows[0] // Solo hay un resultado para el ID
    if (!comboOffer) return null

    const menuItemsResult = await db.execute(
      'SELECT * FROM combo_offer_menu WHERE combo_offers_id = ?',
      [id]
    )

    return {
      ...comboOffer,
      products: menuItemsResult.rows // Los productos del combo
    }
  }

  static async create ({ input }) {
    const combo_offers_id = randomUUID()
    const {
      combo_offers_name,
      description,
      price,
      combo_offers_image,
      products // array de { product_id, quantity }
    } = input

    // Inserción en combo_offers
    await db.execute(
      `INSERT INTO combo_offers (combo_offers_id, combo_offers_name, description, price, combo_offers_image)
       VALUES (?, ?, ?, ?, ?)`,
      [combo_offers_id, combo_offers_name, description, price, combo_offers_image]
    )

    // Inserción en combo_offer_menu
    for (const { product_id, quantity } of products) {
      const combo_offer_menu_id = randomUUID()
      await db.execute(
        `INSERT INTO combo_offer_menu (combo_offer_menu_id, combo_offers_id, product_id, quantity)
         VALUES (?, ?, ?, ?)`,
        [combo_offer_menu_id, combo_offers_id, product_id, quantity]
      )
    }

    return {
      combo_offers_id,
      combo_offers_name,
      description,
      price,
      combo_offers_image,
      products
    }
  }

  static async delete ({ id }) {
    // Eliminar productos del combo
    await db.execute('DELETE FROM combo_offer_menu WHERE combo_offers_id = ?', [id])
    // Eliminar el combo
    const result = await db.execute('DELETE FROM combo_offers WHERE combo_offers_id = ?', [id])
    return result.rowsAffected > 0 // Verificar si se eliminó algún registro
  }

  static async update ({ id, input }) {
    const {
      combo_offers_name,
      description,
      price,
      combo_offers_image,
      products
    } = input

    // Actualizar combo_offers
    await db.execute(
      `UPDATE combo_offers
       SET combo_offers_name = ?, description = ?, price = ?, combo_offers_image = ?
       WHERE combo_offers_id = ?`,
      [combo_offers_name, description, price, combo_offers_image, id]
    )

    // Eliminar y volver a insertar los productos del combo
    await db.execute('DELETE FROM combo_offer_menu WHERE combo_offers_id = ?', [id])

    for (const { product_id, quantity } of products) {
      const combo_offer_menu_id = randomUUID()
      await db.execute(
        `INSERT INTO combo_offer_menu (combo_offer_menu_id, combo_offers_id, product_id, quantity)
         VALUES (?, ?, ?, ?)`,
        [combo_offer_menu_id, id, product_id, quantity]
      )
    }

    return {
      combo_offers_id: id,
      combo_offers_name,
      description,
      price,
      combo_offers_image,
      products
    }
  }
}
