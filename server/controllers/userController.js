import { userSchema } from '../schemas/user.js'
import { setAuthCookie } from '../jwt/auth.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  login = async (req, res) => {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json(result.error)
    }

    const user = await this.userModel.login({ input: result.data })
    if (!user) {
      return res.status(401).json({ message: 'Incorrect username or password' })
    }

    // 🔐 Generate token and save it in the cookie
    await setAuthCookie(res, { id: user._id, username: user.username })

    res.redirect('/')
  }

  register = async (req, res) => {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json(result.error)
    }

    const newUser = await this.userModel.register({ input: result.data })

    if (!newUser) {
      return res.status(400).json({ message: 'User already exists' }) // ✅ Prevents further execution
    }

    // 🔐 Generate token for the new user
    await setAuthCookie(res, { id: newUser.id, username: newUser.user })

    res.redirect('/')
  }
}
