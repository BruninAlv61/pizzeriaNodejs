export const adminMiddleware = (req, res) => {
  const { user } = req.session
  if (!user || user.type !== 'admin') {
    return res.redirect('/login')
  }
}

export const employeeMiddleware = (req, res) => {
  const { user } = req.session
  if (!user || user.type !== 'employee') {
    return res.redirect('/employee/login')
  }
}

// Middleware para verificar cualquier usuario autenticado (admin o employee)
export const authMiddleware = (req, res) => {
  const { user } = req.session
  if (!user) {
    return res.redirect('/login')
  }
}
