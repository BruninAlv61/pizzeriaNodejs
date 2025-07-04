import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { PORT } from './config.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { tokenVerify } from './middlewares/token-verify.js'

import menuRoutes from './routes/menu.routes.js'
import loginRoutes from './routes/login.routes.js'
import registerRoutes from './routes/register.routes.js'
import logoutRoutes from './routes/logout.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import comboOffersRoutes from './routes/combo-offers.routes.js'
import branchesRoutes from './routes/branches.routes.js'
import customersRoutes from './routes/customers.routes.js'
import orderRoutes from './routes/orders.routes.js'
import physicalSalesRoutes from './routes/physical-sales.routes.js'
import employeeRoutes from './routes/employee.routes.js'

dotenv.config()

const app = express()

// Middlewares
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3008',
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(tokenVerify)

// Configurations
const __dirname = dirname(fileURLToPath(import.meta.url))
app.set('views', join(__dirname, 'views'))
app.engine(
  '.hbs',
  engine({
    defaultLayout: 'main',
    layoutDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
      contentFor: function (name, options) {
        if (!this._sections) this._sections = {}
        this._sections[name] = options.fn(this)
        return null
      },
      json: function (context) {
        return JSON.stringify(context)
      },
      eq: (a, b) => a === b,
      not: (value) => !value
    }
  })
)

app.set('view engine', '.hbs')

// Routes
app.use('/menu', menuRoutes)
app.use('/categories', categoriesRoutes)
app.use('/login', loginRoutes)
app.use('/register', registerRoutes)
app.use('/logout', logoutRoutes)
app.use('/combo-offers', comboOffersRoutes)
app.use('/branches', branchesRoutes)
app.use('/customers', customersRoutes)
app.use('/orders', orderRoutes)
app.use('/physical-sales', physicalSalesRoutes)
app.use('/employee', employeeRoutes)

app.get('/', (req, res) => {
  const { user } = req

  if (!user) {
    return res.render('initial-page/initial-page')
  }

  if (user.type === 'admin') {
    return res.redirect('/admin-panel')
  } else if (user.type === 'employee') {
    return res.redirect('/employee-panel')
  }

  res.render('initial-page/initial-page')
})

app.get('/admin-panel', (req, res) => {
  const { user } = req.session
  if (!user || user.type !== 'admin') {
    return res.redirect('/login')
  }
  res.render('admin-panel/admin-panel', { user })
})

app.get('/employee-panel', (req, res) => {
  const { user } = req.session
  if (!user || user.type !== 'employee') {
    return res.redirect('/employee/login')
  }
  res.render('employees/employee-panel', { employee: user })
})

// Public files
app.use(express.static(join(__dirname, 'public')))

// Run server
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
