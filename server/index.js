import express from 'express'
import { PORT } from './config.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/admin-panel', (req, res) => {
  res.send('Welcome to the admin panel!')
})

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
