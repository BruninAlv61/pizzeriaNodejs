import dotenv from 'dotenv'
import express from 'express'
import { PORT } from './config.js'
import cors from 'cors'

import menuRoutes from './routes/menu.routes.js'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/menu', menuRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
