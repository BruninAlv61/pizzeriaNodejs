// server/models/adminModel.js
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import { db } from '../db/connection-turso.js'
import { SALT_ROUNDS } from '../config.js'

const saltRounds = Number(SALT_ROUNDS)

export class AdminModel {
  /* ──────────────── LOGIN ──────────────── */
  static async login ({ input }) {
    try {
      // 1. Obtener al admin por nombre o correo
      const { rows } = await db.execute(
        `SELECT * FROM admin
         WHERE admin_name = ? OR email = ?
         LIMIT 1`,
        [input.admin_name ?? '', input.email ?? '']
      )

      const admin = rows[0]
      if (!admin) return null

      // 2. Comparar password
      const isValid = await bcrypt.compare(input.password, admin.password)
      if (!isValid) throw new Error('Invalid password')

      // 3. Devolver datos (sin el hash, por seguridad)
      const { password, ...safeAdmin } = admin
      return safeAdmin
    } catch (err) {
      console.error('❌ AdminModel.login:', err.message)
      return null
    }
  }

  /* ────────────── REGISTRO ─────────────── */
  static async register ({ input }) {
    try {
      // 1. ¿Ya existe?
      const { rows: exists } = await db.execute(
        `SELECT 1 FROM admin
         WHERE admin_name = ? OR email = ?
         LIMIT 1`,
        [input.admin_name, input.email]
      )
      if (exists.length) throw new Error('User already exists')

      // 2. Hash de la contraseña
      const hashed = await bcrypt.hash(input.password, saltRounds)

      // 3. Insertar
      const admin_id = randomUUID()
      await db.execute(
        `INSERT INTO admin (admin_id, admin_name, email, password)
         VALUES (?, ?, ?, ?)`,
        [admin_id, input.admin_name, input.email, hashed]
      )

      return {
        admin_id,
        admin_name: input.admin_name,
        email: input.email
      }
    } catch (err) {
      console.error('❌ AdminModel.register:', err.message)
      return null
    }
  }
}
