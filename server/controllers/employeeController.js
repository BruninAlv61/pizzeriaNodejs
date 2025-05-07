// server/controllers/employeeController.js
import { employeeSchema, employeeRegisterSchema } from '../schemas/employee.js'
import { setEmployeeAuthCookie } from '../jwt/auth.js'

export class EmployeeController {
  constructor ({ employeeModel, ordersModel }) {
    this.employeeModel = employeeModel
    this.ordersModel = ordersModel
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

  renderOrders = async (req, res) => {
    const { user } = req.session
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    const { employee_branch } = user
    if (!employee_branch) return res.status(400).json({ message: 'Branch not found' })

    console.log('Employee branch:', employee_branch)

    // Obtener órdenes del día actual para esta sucursal
    const orders = await this.ordersModel.getByBranchId({ branch_id: employee_branch })

    // Formatear la fecha y hora para mejor visualización
    orders.forEach(order => {
      const date = new Date(order.created_at)
      order.formattedDate = date.toLocaleString()
    })

    res.render('employees/orders', { orders })
  }

  updateOrderStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    if (!id || !status) {
      return res.status(400).json({ message: 'Missing order id or status' })
    }

    const updated = await this.ordersModel.updateOrderStatus({
      order_id: id,
      order_status: status
    })

    if (!updated) {
      return res.status(404).json({ message: 'Order not found or not updated' })
    }

    res.json({ success: true })
  }
}
