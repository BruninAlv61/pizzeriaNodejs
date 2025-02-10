import { connectUser } from '../db/connection.js'

export class UserModel {
  login = async ({ input }) => {
  }

  register = async ({ input }) => {
    const db = await connectUser()

    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }
}
