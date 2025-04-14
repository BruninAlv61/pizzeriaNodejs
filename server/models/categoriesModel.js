import { db } from '../db/connection-turso.js'
import { categoriesSchema } from '../schemas/categories.js'
import { randomUUID } from 'node:crypto'

export class CategoriesModel {
  static async getAll () {
    const result = await db.execute('SELECT * FROM categories')
    return result.rows
  }

  static async getById ({ id }) {
    if (!/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/.test(id)) {
      throw new Error('The provided ID is not a valid UUID')
    }

    // Obtener una categoría por su UUID
    const result = await db.execute('SELECT * FROM categories WHERE categories_id = ?', [id])
    return result.rows[0]
  }

  static async create ({ input }) {
    // Log para revisar los datos de entrada
    console.log('Datos recibidos para crear la categoría:', input)

    // Validar los datos de la categoría
    const validatedCategory = categoriesSchema.parse(input)
    try {
      console.log('Datos validados correctamente:', validatedCategory)
    } catch (error) {
      console.error('Error en la validación de datos:', error.errors)
      throw new Error('Datos inválidos, no se puede crear la categoría')
    }

    // Asegúrate de que los valores son de tipo string
    const { category_name, category_description, category_image } = validatedCategory
    console.log('Datos para insertar en la base de datos:', category_name, category_description, category_image)

    // Generamos el UUID
    const categoryId = randomUUID()

    // Revisa si hay algo raro con los tipos de datos antes de enviarlos
    console.log('Insertando en la base de datos:', categoryId, category_name, category_description, category_image)

    try {
      const result = await db.execute(
        'INSERT INTO categories (categories_id, category_name, category_description, category_image) VALUES (?, ?, ?, ?) RETURNING categories_id',
        [categoryId, category_name, category_description, category_image]
      )

      return {
        categories_id: result.rows[0].categories_id,
        ...validatedCategory
      }
    } catch (dbError) {
      console.error('Error al insertar en la base de datos:', dbError.message)
      throw new Error('Error al insertar la categoría en la base de datos')
    }
  }

  static async delete ({ id }) {
    const result = await db.execute('DELETE FROM categories WHERE categories_id = ?', [id])
    return result.rowsAffected > 0
  }

  static async update ({ id, input }) {
    const validatedCategory = categoriesSchema.partial().parse(input)

    const { categoryName, categoryDescription, categoryImage } = validatedCategory
    await db.execute(
      'UPDATE categories SET category_name = ?, category_description = ?, category_image = ? WHERE categories_id = ?',
      [categoryName, categoryDescription, categoryImage, id]
    )

    const updatedCategory = await db.execute(
      'SELECT * FROM categories WHERE categories_id = ?',
      [id]
    )

    return updatedCategory.rows[0]
  }
}
