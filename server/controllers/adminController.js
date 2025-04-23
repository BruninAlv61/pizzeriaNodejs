// server/controllers/adminController.js
import { adminSchema } from '../schemas/admin.js'
import { setAuthCookie } from '../jwt/auth.js'

export class AdminController {
  constructor ({ adminModel }) {
    this.adminModel = adminModel
  }

  /* ---------- LOGIN ---------- */
  login = async (req, res) => {
    const result = adminSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json(result.error)

    const admin = await this.adminModel.login({ input: result.data })
    if (!admin) return res.status(401).json({ message: 'Incorrect credentials' })

    /* <── payload usa los nombres REALES */
    setAuthCookie(res, {
      admin_id: admin.admin_id,
      admin_name: admin.admin_name
    })

    res.redirect('/')
  }

  /* --------- REGISTER -------- */
  register = async (req, res) => {
    const result = adminSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json(result.error)

    const created = await this.adminModel.register({ input: result.data })
    if (!created) return res.status(400).json({ message: 'User already exists' })

    setAuthCookie(res, {
      admin_id: created.admin_id,
      admin_name: created.admin_name
    })

    res.redirect('/')
  }
}
