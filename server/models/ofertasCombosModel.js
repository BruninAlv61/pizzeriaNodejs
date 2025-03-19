import { ObjectId } from 'mongodb'
import { connectOfertasCombos } from '../db/connection.js'

export class OfertasCombosModel {
  static async getAll () {
    const db = await connectOfertasCombos()
    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connectOfertasCombos()
    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      throw new Error('El ID proporcionado no es válido')
    }

    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await connectOfertasCombos()
    const { insertedId } = await db.insertOne(input)
    return {
      id: insertedId,
      ...input
    }
  }

  static async delete ({ id }) {
    const db = await connectOfertasCombos()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connectOfertasCombos()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })

    if (!ok) return false

    return value
  }
}
