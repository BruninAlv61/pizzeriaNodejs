import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { PORT } from './config.js'
import cors from 'cors'

import menuRoutes from './routes/menu.routes.js'
import loginRoutes from './routes/login.routes.js'
import registerRoutes from './routes/register.routes.js'

dotenv.config()

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))

// Configurations
const __dirname = dirname(fileURLToPath(import.meta.url))
app.set('views', join(__dirname, 'views'))
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutDir: join(app.get('views'), 'layouts'),
  partialsDir: join(app.get('views'), 'partials'),
  extname: '.hbs'
}))

app.set('view engine', '.hbs')

// Routes
app.use('/menu', menuRoutes)
app.use('/login', loginRoutes)
app.use('/register', registerRoutes)

// Public files
app.use(express.static(join(__dirname, 'public')))

// Run server
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
