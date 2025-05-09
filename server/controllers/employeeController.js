// server/controllers/employeeController.js
import { employeeSchema, employeeRegisterSchema } from '../schemas/employee.js'
import { setEmployeeAuthCookie } from '../jwt/auth.js'
import { validatePhysicalSale } from '../schemas/physicalSalesSchema.js'

export class EmployeeController {
  constructor ({ employeeModel, ordersModel, customersModel, menuModel, comboOffersModel, physicalSalesModel }) {
    this.employeeModel = employeeModel
    this.ordersModel = ordersModel
    this.customersModel = customersModel
    this.menuModel = menuModel
    this.comboOffersModel = comboOffersModel
    this.physicalSalesModel = physicalSalesModel
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

  renderPhysicalSales = async (req, res) => {
    const { user } = req.session
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    try {
      // Get all physical sales
      const allSales = await this.physicalSalesModel.getAll()

      // Filter sales to show only today's sales
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Start of today

      const sales = allSales.filter(sale => {
        const saleDate = new Date(sale.sale_date)
        saleDate.setHours(0, 0, 0, 0) // Remove time part for comparison
        return saleDate.getTime() === today.getTime()
      })

      // Format dates for better visualization
      sales.forEach(sale => {
        if (sale.sale_date) {
          const date = new Date(sale.sale_date)
          sale.sale_date = date.toLocaleString()
        }
      })

      res.render('employees/physical-sales', {
        sales,
        todayDate: today.toLocaleDateString()
      })
    } catch (error) {
      console.error('Error fetching physical sales:', error)
      res.render('employees/physical-sales', {
        sales: [],
        error: 'Error loading physical sales. Please try again later.'
      })
    }
  }

  renderAddPhysicalSale = async (req, res) => {
    const { user } = req.session
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    try {
      const customers = await this.customersModel.getAll()
      const products = await this.menuModel.getAll()
      const combos = await this.comboOffersModel.getAll()

      res.render('employees/physical-sales-add', {
        customers,
        products,
        combos,
        user
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  createPhysicalSale = async (req, res) => {
    const { user } = req.session
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    try {
      // Parse items from JSON string
      const input = { ...req.body }

      console.log(input)

      if (typeof input.items === 'string') {
        input.items = JSON.parse(input.items)
      }

      // Convert price to number
      input.total_price = Number(input.total_price)

      // Add sale_date
      input.sale_date = new Date().toISOString()

      const validation = validatePhysicalSale(input)

      if (!validation.success) {
        const errors = validation.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))

        return res.status(400).json({ errors })
      }

      const result = await this.employeeModel.createPhysicalSale({ input: validation.data })
      if (result) {
        res.redirect('/employee/physical-sales')
      } else {
        res.status(400).json({ error: 'Error creating physical sale' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  deletePhysicalSale = async (req, res) => {
    const { id } = req.params
    const { user } = req.session

    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    try {
      const deleted = await this.physicalSalesModel.delete({ id })

      if (deleted) {
        res.json({ success: true })
      } else {
        res.status(404).json({ error: 'Sale not found or could not be deleted' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
