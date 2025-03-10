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

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      throw new Error('El ID proporcionado no es válido')
    }

    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await connectCategories()

    const categoriaValidada = categoriesSchema.parse(input)

    const { insertedId } = await db.insertOne(categoriaValidada)

    return {
      id: insertedId,
      ...categoriaValidada
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

    const productoValidado = categoriesSchema.partial().parse(input)

    const { value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: productoValidado },
      { returnDocument: 'after' }
    )

    return value
  }
}
