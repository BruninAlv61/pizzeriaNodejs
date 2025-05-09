// server/models/employeeModel.js
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import { db } from '../db/connection-turso.js'
import { SALT_ROUNDS } from '../config.js'
import { PhysicalSalesModel } from './physicalSalesModel.js'

const saltRounds = Number(SALT_ROUNDS)

export class EmployeeModel {
  /* ──────────────── LOGIN ──────────────── */
  static async login ({ input }) {
    try {
      // 1. Obtener al empleado por nombre o correo
      const { rows } = await db.execute(
        `SELECT * FROM employees
         WHERE name = ? OR email = ?
         LIMIT 1`,
        [input.name ?? '', input.email ?? '']
      )

      const employee = rows[0]
      if (!employee) return null

      // 2. Comparar password
      const isValid = await bcrypt.compare(input.password, employee.password)
      if (!isValid) throw new Error('Invalid password')

      // 3. Devolver datos (sin el hash, por seguridad)
      const { password, ...safeEmployee } = employee
      return safeEmployee
    } catch (err) {
      console.error('❌ EmployeeModel.login:', err.message)
      return null
    }
  }

  /* ────────────── REGISTRO ─────────────── */
  static async register ({ input }) {
    try {
      // 1. ¿Ya existe?
      const { rows: exists } = await db.execute(
        `SELECT 1 FROM employees
         WHERE name = ? OR email = ?
         LIMIT 1`,
        [input.name, input.email]
      )
      if (exists.length) throw new Error('Employee already exists')

      // 2. Hash de la contraseña
      const hashed = await bcrypt.hash(input.password, saltRounds)

      // 3. Insertar
      const employee_id = randomUUID()
      await db.execute(
        `INSERT INTO employees (
          employee_id, name, lastname, password, 
          phone_number, address, email, employee_branch
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employee_id,
          input.name,
          input.lastname,
          hashed,
          input.phone_number,
          input.address,
          input.email,
          input.employee_branch
        ]
      )

      return {
        employee_id,
        name: input.name,
        email: input.email,
        employee_branch: input.employee_branch
      }
    } catch (err) {
      console.error('❌ EmployeeModel.register:', err.message)
      return null
    }
  }

  static async createPhysicalSale ({ input }) {
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

      const sale = await PhysicalSalesModel.getById({ id: physical_sales_id })
      return sale
    } catch (e) {
      throw new Error('Error creating physical sale: ' + e.message)
    }
  }
}
