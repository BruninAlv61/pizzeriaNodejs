import express from 'express'
import { EmployeeController } from '../controllers/employeeController.js'
import { EmployeeModel } from '../models/employeeModel.js'
import { BranchesModel } from '../models/branchesModel.js' // Import BranchModel
import { OrdersModel } from '../models/ordersModel.js'

const router = express.Router()

const employeeController = new EmployeeController({ employeeModel: EmployeeModel, ordersModel: OrdersModel })

// Rutas de autenticación para empleados
router.get('/login', (req, res) => {
  res.render('login/employee-login')
})

router.post('/login', employeeController.login)

// Modificar esta ruta para incluir las sucursales
router.get('/register', async (req, res) => {
  try {
    // Obtener todas las sucursales de la base de datos
    const branches = await BranchesModel.getAll()

    // Renderizar la plantilla con las sucursales
    res.render('register/employee-register', { branches })
  } catch (error) {
    console.error('Error loading branches:', error)
    res.render('register/employee-register', {
      branches: [],
      error: 'Error loading branches. Please try again later.'
    })
  }
})

router.post('/register', employeeController.register)

router.get('/physical-sales', (req, res) => {
  res.render('employees/physical-sales')
})

router.get('/orders', employeeController.renderOrders)

router.put('/orders/:id/status', employeeController.updateOrderStatus)

export default router
