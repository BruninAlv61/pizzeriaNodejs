import { db } from '../db/connection-turso.js'
import { randomUUID } from 'node:crypto'

export class CustomersModel {
  static async getAll () {
    const result = await db.execute('SELECT * FROM customers ORDER BY name')
    return result.rows
  }

  static async getById ({ id }) {
    const result = await db.execute({
      sql: 'SELECT * FROM customers WHERE customer_id = ?',
      args: [id]
    })

    if (result.rows.length === 0) return null

    return result.rows[0]
  }

  static async create ({ input }) {
    const {
      name,
      lastname,
      password,
      email,
      phone_number
    } = input

    const customer_id = randomUUID()

    try {
      await db.execute({
        sql: `
          INSERT INTO customers (customer_id, name, lastname, password, email, phone_number)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [customer_id, name, lastname, password, email, phone_number || null]
      })

      const customer = await this.getById({ id: customer_id })
      return customer
    } catch (e) {
      throw new Error('Error creating customer: ' + e.message)
    }
  }

  static async delete ({ id }) {
    try {
      await db.execute({
        sql: 'DELETE FROM customers WHERE customer_id = ?',
        args: [id]
      })
      return true
    } catch (e) {
      throw new Error('Error deleting customer: ' + e.message)
    }
  }

  static async update ({ id, input }) {
    try {
      const {
        name,
        lastname,
        password,
        email,
        phone_number
      } = input

      // Check if customer exists
      const customer = await this.getById({ id })
      if (!customer) return null

      await db.execute({
        sql: `
          UPDATE customers
          SET name = ?, lastname = ?, password = ?, email = ?, phone_number = ?
          WHERE customer_id = ?
        `,
        args: [name, lastname, password, email, phone_number || null, id]
      })

      const updatedCustomer = await this.getById({ id })
      return updatedCustomer
    } catch (e) {
      throw new Error('Error updating customer: ' + e.message)
    }
  }
}
