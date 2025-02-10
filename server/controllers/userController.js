import { userSchema } from '../schemas/user.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  login = async (req, res) => {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json(result.error)
    }

    const newUser = await this.userModel.login({ input: result.data })
    if (!newUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.json(newUser)
  }

  register = async (req, res) => {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json(result.error)
    }

    const newUser = await this.userModel.register({ input: result.data })
    res.json(newUser)
  }
}
