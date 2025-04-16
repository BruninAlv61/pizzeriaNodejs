import { db } from '../db/connection-turso.js'
import { randomUUID } from 'node:crypto'

export class BranchesModel {
  static async getAll () {
    const result = await db.execute('SELECT * FROM branches')
    return result.rows
  }

  static async create ({ input }) {
    const id = randomUUID()

    await db.execute(
      `INSERT INTO branches (branch_id, province, locality, address, phone_number)
       VALUES (?, ?, ?, ?, ?)`,
      [id, input.province, input.locality, input.address, input.phone_number]
    )

    return {
      branch_id: id,
      ...input
    }
  }

  static async getById ({ id }) {
    const result = await db.execute(
      'SELECT * FROM branches WHERE branch_id = ?',
      [id]
    )

    return result.rows[0]
  }

  static async update ({ id, input }) {
    await db.execute(
      `UPDATE branches
       SET province = ?, locality = ?, address = ?, phone_number = ?
       WHERE branch_id = ?`,
      [input.province, input.locality, input.address, input.phone_number, id]
    )

    return this.getById({ id }) // Devolver el branch actualizado
  }

  static async delete ({ id }) {
    const result = await db.execute(
      'DELETE FROM branches WHERE branch_id = ?',
      [id]
    )

    return result.rowsAffected > 0
  }
}
