import { connect } from '../db/connection.js'
import { menuSchema } from '../schemas/menu.js'
import { ObjectId } from 'mongodb'

export class MenuModel {
  static async getAll ({ categoria }) {
    const db = await connect()

    if (categoria) {
      return db.find({
        categoria: {
          $regex: categoria,
          $options: 'i'
        }
      }).toArray()
    }

    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connect()

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      throw new Error('El ID proporcionado no es válido')
    }

    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await connect()

    const productoValidado = menuSchema.parse(input)

    const { insertedId } = await db.insertOne(productoValidado)

    return {
      id: insertedId,
      ...productoValidado
    }
  }

  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const productoValidado = menuSchema.partial().parse(input)

    const { value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: productoValidado },
      { returnDocument: 'after' }
    )

    return value
  }
}
