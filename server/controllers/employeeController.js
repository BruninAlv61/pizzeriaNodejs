// server/controllers/employeeController.js
import { employeeSchema, employeeRegisterSchema } from '../schemas/employee.js'
import { setEmployeeAuthCookie } from '../jwt/auth.js'

export class EmployeeController {
  constructor ({ employeeModel }) {
    this.employeeModel = employeeModel
  }

  /* ---------- LOGIN ---------- */
  login = async (req, res) => {
    const result = employeeSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json(result.error)

    const employee = await this.employeeModel.login({ input: result.data })
    if (!employee) return res.status(401).json({ message: 'Incorrect credentials' })

    /* <── payload usa los nombres REALES de la base de datos */
    setEmployeeAuthCookie(res, {
      employee_id: employee.employee_id,
      name: employee.name,
      employee_branch: employee.employee_branch
    })

    res.redirect('/employee-panel')
  }

  /* --------- REGISTER -------- */
  register = async (req, res) => {
    const result = employeeRegisterSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json(result.error)

    const created = await this.employeeModel.register({ input: result.data })
    if (!created) return res.status(400).json({ message: 'Employee already exists' })

    setEmployeeAuthCookie(res, {
      employee_id: created.employee_id,
      name: created.name,
      employee_branch: created.employee_branch
    })

    res.redirect('/employee-panel')
  }
}
