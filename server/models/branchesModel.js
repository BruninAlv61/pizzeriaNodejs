import { connectBranches } from '../db/connection.js'
import { ObjectId } from 'mongodb'

export class BranchesModel {
  static async getAll () {
    const db = await connectBranches()
    return db.find({}).toArray()
  }

  static async create ({ input }) {
    const db = await connectBranches()
    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async getById ({ id }) {
    const db = await connectBranches()
    // Validate that the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error('The provided ID is not valid')
    }

    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async update ({ id, input }) {
    const db = await connectBranches()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnNewDocument: true }
    )

    if (!ok) return false

    return value
  }

  static async delete ({ id }) {
    const db = await connectBranches()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }
}
