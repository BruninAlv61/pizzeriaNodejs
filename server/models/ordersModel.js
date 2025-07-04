import { db } from '../db/connection-turso.js'
import { randomUUID } from 'node:crypto'

export class OrdersModel {
  static async getAll () {
    const result = await db.execute(`
      SELECT o.*, 
             c.name as customer_name, c.lastname as customer_lastname,
             b.province, b.locality
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN branches b ON o.branch_id = b.branch_id
      ORDER BY o.created_at DESC
    `)
    return result.rows
  }

  static async getById ({ id }) {
    const result = await db.execute({
      sql: `
        SELECT o.*, 
               c.name as customer_name, c.lastname as customer_lastname,
               b.province, b.locality
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN branches b ON o.branch_id = b.branch_id
        WHERE o.order_id = ?
      `,
      args: [id]
    })

    if (result.rows.length === 0) return null

    // Get order items
    const itemsResult = await db.execute({
      sql: `
        SELECT si.*, 
               m.product_name, m.product_image,
               co.combo_offers_name, co.combo_offers_image
        FROM sales_items si
        LEFT JOIN menu m ON si.product_id = m.product_id
        LEFT JOIN combo_offers co ON si.combo_offers_id = co.combo_offers_id
        WHERE si.order_id = ?
      `,
      args: [id]
    })

    const order = result.rows[0]
    order.items = itemsResult.rows.map(item => {
      return {
        id: item.sales_item_id,
        product_id: item.product_id,
        combo_offers_id: item.combo_offers_id,
        quantity: item.quantity,
        price: item.price,
        name: item.product_name || item.combo_offers_name,
        image: item.product_image || item.combo_offers_image,
        type: item.product_id ? 'product' : 'combo'
      }
    })

    return order
  }

  // Método actualizado para obtener órdenes por branch_id y filtrar por el día actual
  static async getByBranchId ({ branch_id }) {
  // Obtenemos la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]

    const result = await db.execute({
      sql: `
      SELECT o.*, c.name AS customer_name, c.lastname AS customer_lastname 
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.branch_id = ? 
      AND DATE(o.created_at) = ?
      ORDER BY o.created_at DESC
    `,
      args: [branch_id, today]
    })

    // Para cada orden, obtenemos sus productos
    for (const order of result.rows) {
    // Obtener los productos de la orden
      const itemsResult = await db.execute({
        sql: `
        SELECT si.quantity, si.price, 
               CASE 
                 WHEN si.product_id IS NOT NULL THEN (SELECT m.product_name FROM menu m WHERE m.product_id = si.product_id)
                 WHEN si.combo_offers_id IS NOT NULL THEN (SELECT co.combo_offers_name FROM combo_offers co WHERE co.combo_offers_id = si.combo_offers_id)
                 ELSE 'Producto desconocido'
               END AS item_name,
               si.product_id, si.combo_offers_id
        FROM sales_items si
        WHERE si.order_id = ?
      `,
        args: [order.order_id]
      })

      order.items = itemsResult.rows
    }

    return result.rows
  }

  // Método para actualizar el estado de una orden
  static async updateOrderStatus ({ order_id, order_status }) {
    const result = await db.execute({
      sql: `
      UPDATE orders
      SET order_status = ?
      WHERE order_id = ?
    `,
      args: [order_status, order_id]
    })

    return result.rowsAffected > 0 || result.affectedRows > 0
  }

  static async create ({ input }) {
    const {
      customer_id,
      branch_id,
      total_price,
      order_status,
      items
    } = input

    const order_id = randomUUID()
    const created_at = new Date().toISOString()

    try {
      // Insert order
      await db.execute({
        sql: `
          INSERT INTO orders (order_id, customer_id, branch_id, total_price, order_status, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [order_id, customer_id, branch_id, total_price, order_status, created_at]
      })

      // Insert items
      for (const item of items) {
        const sales_item_id = randomUUID()
        const isProduct = item.type === 'product'

        await db.execute({
          sql: `
            INSERT INTO sales_items (
              sales_item_id, order_id, product_id, combo_offers_id, 
              quantity, price
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `,
          args: [
            sales_item_id,
            order_id,
            isProduct ? item.id : null,
            !isProduct ? item.id : null,
            item.quantity,
            item.price
          ]
        })
      }

      const order = await this.getById({ id: order_id })
      return order
    } catch (e) {
      throw new Error('Error creating order: ' + e.message)
    }
  }

  static async delete ({ id }) {
    // Start transaction
    await db.execute('BEGIN TRANSACTION')

    try {
      // Delete sales_items related to this order
      await db.execute({
        sql: 'DELETE FROM sales_items WHERE order_id = ?',
        args: [id]
      })

      // Delete the order
      await db.execute({
        sql: 'DELETE FROM orders WHERE order_id = ?',
        args: [id]
      })

      // Commit transaction
      await db.execute('COMMIT')
      return true
    } catch (e) {
      // Rollback on error
      await db.execute('ROLLBACK')
      throw new Error('Error deleting order: ' + e.message)
    }
  }

  static async update ({ id, input }) {
    const {
      customer_id,
      branch_id,
      total_price,
      order_status,
      items
    } = input

    try {
      // Check if order exists
      const order = await this.getById({ id })
      if (!order) {
        return null
      }

      // Update order
      await db.execute({
        sql: `
          UPDATE orders
          SET customer_id = ?, branch_id = ?, total_price = ?, order_status = ?
          WHERE order_id = ?
        `,
        args: [customer_id, branch_id, total_price, order_status, id]
      })

      // Delete existing sales_items
      await db.execute({
        sql: 'DELETE FROM sales_items WHERE order_id = ?',
        args: [id]
      })

      // Insert new items
      for (const item of items) {
        const sales_item_id = randomUUID()
        const isProduct = item.type === 'product'

        await db.execute({
          sql: `
            INSERT INTO sales_items (
              sales_item_id, order_id, product_id, combo_offers_id, 
              quantity, price
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `,
          args: [
            sales_item_id,
            id,
            isProduct ? item.id : null,
            !isProduct ? item.id : null,
            item.quantity,
            item.price
          ]
        })
      }

      const updatedOrder = await this.getById({ id })
      return updatedOrder
    } catch (e) {
      throw new Error('Error updating order: ' + e.message)
    }
  }
}
