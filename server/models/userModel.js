import { connectUser } from '../db/connection.js'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../config.js'

const saltRounds = Number(SALT_ROUNDS)

export class UserModel {
  login = async ({ input }) => {
    try {
      const db = await connectUser()
      const user = await db.findOne({ username: input.username })

      if (!user) return null

      const isValid = await bcrypt.compare(input.password, user.password)
      if (!isValid) throw new Error('password is invalid')

      return user // Devuelve los datos del usuario
    } catch (error) {
      console.error(error)
      return null
    }
  }

  register = async ({ input }) => {
    try {
      const db = await connectUser()
      const user = await db.findOne({ username: input.username })
      if (user) throw new Error('El usuario ya existe')

      input.password = await bcrypt.hash(input.password, saltRounds)

      const { insertedId } = await db.insertOne(input)

      return {
        id: insertedId,
        user: input.username
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
