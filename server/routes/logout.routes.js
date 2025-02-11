import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .redirect('/login')
})

export default router
