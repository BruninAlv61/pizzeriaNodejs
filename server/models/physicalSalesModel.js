import { db } from '../db/connection-turso.js'
import { randomUUID } from 'node:crypto'

export class PhysicalSalesModel {
  static async getAll () {
    const result = await db.execute(`
      SELECT ps.*, 
             c.name as customer_name, c.lastname as customer_lastname,
             b.province, b.locality
      FROM physical_sales ps
      LEFT JOIN customers c ON ps.customer_id = c.customer_id
      JOIN branches b ON ps.branch_id = b.branch_id
      ORDER BY ps.sale_date DESC
    `)
    return result.rows
  }

  static async getById ({ id }) {
    const result = await db.execute({
      sql: `
        SELECT ps.*, 
               c.name as customer_name, c.lastname as customer_lastname,
               b.province, b.locality
        FROM physical_sales ps
        LEFT JOIN customers c ON ps.customer_id = c.customer_id
        JOIN branches b ON ps.branch_id = b.branch_id
        WHERE ps.physical_sales_id = ?
      `,
      args: [id]
    })

    if (result.rows.length === 0) return null

    // Get sale items
    const itemsResult = await db.execute({
      sql: `
        SELECT si.*, 
               m.product_name, m.product_image,
               co.combo_offers_name, co.combo_offers_image
        FROM sales_items si
        LEFT JOIN menu m ON si.product_id = m.product_id
        LEFT JOIN combo_offers co ON si.combo_offers_id = co.combo_offers_id
        WHERE si.physical_sale_id = ?
      `,
      args: [id]
    })

    const sale = result.rows[0]
    sale.items = itemsResult.rows.map(item => {
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

    return sale
  }

  static async create ({ input }) {
    const {
      customer_id,
      customer_phone,
      branch_id,
      total_price,
      payment_method,
      items
    } = input

    const physical_sales_id = randomUUID()
    const sale_date = new Date().toISOString()

    try {
      // Insert physical sale
      await db.execute({
        sql: `
          INSERT INTO physical_sales (
            physical_sales_id, customer_id, sale_date, total_price, 
            payment_method, customer_phone, branch_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          physical_sales_id,
          customer_id || null,
          sale_date,
          total_price,
          payment_method,
          customer_phone || null,
          branch_id
        ]
      })

      // Insert items
      for (const item of items) {
        const sales_item_id = randomUUID()
        const isProduct = item.type === 'product'

        await db.execute({
          sql: `
            INSERT INTO sales_items (
              sales_item_id, physical_sale_id, product_id, combo_offers_id, 
              quantity, price
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `,
          args: [
            sales_item_id,
            physical_sales_id,
            isProduct ? item.id : null,
            !isProduct ? item.id : null,
            item.quantity,
            item.price
          ]
        })
      }

      const sale = await this.getById({ id: physical_sales_id })
      return sale
    } catch (e) {
      throw new Error('Error creating physical sale: ' + e.message)
    }
  }

  static async delete ({ id }) {
    try {
      // Delete sales_items related to this sale
      await db.execute({
        sql: 'DELETE FROM sales_items WHERE physical_sale_id = ?',
        args: [id]
      })

      // Delete the physical sale
      await db.execute({
        sql: 'DELETE FROM physical_sales WHERE physical_sales_id = ?',
        args: [id]
      })

      return true
    } catch (e) {
      throw new Error('Error deleting physical sale: ' + e.message)
    }
  }

  static async update ({ id, input }) {
    const {
      customer_id,
      customer_phone,
      branch_id,
      total_price,
      payment_method,
      items
    } = input

    try {
      // Check if sale exists
      const sale = await this.getById({ id })
      if (!sale) {
        return null
      }

      // Update physical sale
      await db.execute({
        sql: `
          UPDATE physical_sales
          SET customer_id = ?, customer_phone = ?, branch_id = ?, 
              total_price = ?, payment_method = ?
          WHERE physical_sales_id = ?
        `,
        args: [
          customer_id || null,
          customer_phone || null,
          branch_id,
          total_price,
          payment_method,
          id
        ]
      })

      // Delete existing sales_items
      await db.execute({
        sql: 'DELETE FROM sales_items WHERE physical_sale_id = ?',
        args: [id]
      })

      // Insert new items
      for (const item of items) {
        const sales_item_id = randomUUID()
        const isProduct = item.type === 'product'

        await db.execute({
          sql: `
            INSERT INTO sales_items (
              sales_item_id, physical_sale_id, product_id, combo_offers_id, 
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

      const updatedSale = await this.getById({ id })
      return updatedSale
    } catch (e) {
      throw new Error('Error updating physical sale: ' + e.message)
    }
  }
}
