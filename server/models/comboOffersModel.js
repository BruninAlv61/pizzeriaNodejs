import { ObjectId } from 'mongodb'
import { connectComboOffers } from '../db/connection.js'

export class ComboOffersModel { // Renombrado
  static async getAll () {
    const db = await connectComboOffers()
    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connectComboOffers()

    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ID format')
    }

    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await connectComboOffers()
    const { insertedId } = await db.insertOne(input)
    return {
      id: insertedId,
      ...input
    }
  }

  static async delete ({ id }) {
    const db = await connectComboOffers()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connectComboOffers()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnNewDocument: true }
    )

    if (!ok) return false

    return value
  }
}
