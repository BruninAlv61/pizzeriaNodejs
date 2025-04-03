import { connectCategories } from '../db/connection.js'
import { categoriesSchema } from '../schemas/categories.js'
import { ObjectId } from 'mongodb'

export class CategoriesModel {
  static async getAll () {
    const db = await connectCategories()
    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connectCategories()

    // Validate that the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error('The provided ID is not valid')
    }

    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await connectCategories()

    const validatedCategory = categoriesSchema.parse(input)

    const { insertedId } = await db.insertOne(validatedCategory)

    return {
      id: insertedId,
      ...validatedCategory
    }
  }

  static async delete ({ id }) {
    const db = await connectCategories()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connectCategories()
    const objectId = new ObjectId(id)

    const validatedCategory = categoriesSchema.partial().parse(input)

    const { value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: validatedCategory },
      { returnDocument: 'after' }
    )

    return value
  }
}
