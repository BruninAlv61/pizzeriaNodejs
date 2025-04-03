import { connectMenu } from '../db/connection.js'
import { menuSchema } from '../schemas/menu.js'
import { ObjectId } from 'mongodb'

export class MenuModel {
  static async getAll ({ category }) {
    const db = await connectMenu()

    if (category) {
      return db.find({
        category: {
          $regex: category,
          $options: 'i'
        }
      }).toArray()
    }

    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connectMenu()

    // Validate that the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error('The provided ID is not valid')
    }

    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await connectMenu()

    const validatedProduct = menuSchema.parse(input)

    const { insertedId } = await db.insertOne(validatedProduct)

    return {
      id: insertedId,
      ...validatedProduct
    }
  }

  static async delete ({ id }) {
    const db = await connectMenu()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connectMenu()
    const objectId = new ObjectId(id)

    const validatedProduct = menuSchema.partial().parse(input)

    const { value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: validatedProduct },
      { returnDocument: 'after' }
    )

    return value
  }
}
