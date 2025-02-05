import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('login/login')
})

export default router
