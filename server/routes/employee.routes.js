import express from 'express'
import { EmployeeController } from '../controllers/employeeController.js'
import { EmployeeModel } from '../models/employeeModel.js'
import { BranchesModel } from '../models/branchesModel.js'
import { OrdersModel } from '../models/ordersModel.js'
import { CustomersModel } from '../models/customersModel.js'
import { MenuModel } from '../models/menuModel.js'
import { ComboOffersModel } from '../models/comboOffersModel.js'
import { PhysicalSalesModel } from '../models/physicalSalesModel.js' // Import PhysicalSalesModel

const router = express.Router()

const employeeController = new EmployeeController({
  employeeModel: EmployeeModel,
  ordersModel: OrdersModel,
  customersModel: CustomersModel,
  menuModel: MenuModel,
  comboOffersModel: ComboOffersModel,
  physicalSalesModel: PhysicalSalesModel // Add PhysicalSalesModel
})

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

// Updated to use the controller method that fetches sales data
router.get('/physical-sales', employeeController.renderPhysicalSales)

router.get('/physical-sales/add', employeeController.renderAddPhysicalSale)

router.get('/orders', employeeController.renderOrders)

router.put('/orders/:id/status', employeeController.updateOrderStatus)

router.post('/physical-sales', employeeController.createPhysicalSale)

// Add delete route for physical sales
router.delete('/physical-sales/:id', employeeController.deletePhysicalSale)

export default router
