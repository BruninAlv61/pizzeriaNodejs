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
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })
    }

    // 🔐 Generar token y guardarlo en la cookie
    setAuthCookie(res, { id: user._id, username: user.username })

    res.redirect('/admin-panel')
  }

  register = async (req, res) => {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json(result.error)
    }

    const newUser = await this.userModel.register({ input: result.data })

    if (!newUser) {
      return res.status(400).json({ message: 'El usuario ya existe' }) // ✅ Evita que avance
    }

    // 🔐 Generar token para el nuevo usuario
    setAuthCookie(res, { id: newUser.id, username: newUser.user })

    res.redirect('/admin-panel')
  }
}
