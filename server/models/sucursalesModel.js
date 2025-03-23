import { connectSucursales } from '../db/connection.js'
import { ObjectId } from 'mongodb'

export class SucursalesModel {
  static async getAll () {
    const db = await connectSucursales()
    return db.find({}).toArray()
  }

  static async create ({ input }) {
    const db = await connectSucursales()
    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async getById ({ id }) {
    const db = await connectSucursales()
    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      throw new Error('El ID proporcionado no es válido')
    }

    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async update ({ id, input }) {
    const db = await connectSucursales()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })

    if (!ok) return false

    return value
  }

  static async delete ({ id }) {
    const db = await connectSucursales()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }
}
