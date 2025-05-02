import express from 'express'
import { EmployeeController } from '../controllers/employeeController.js'
import { EmployeeModel } from '../models/employeeModel.js'
import { BranchesModel } from '../models/branchesModel.js' // Import BranchModel

const router = express.Router()

const employeeController = new EmployeeController({ employeeModel: EmployeeModel })

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

export default router
