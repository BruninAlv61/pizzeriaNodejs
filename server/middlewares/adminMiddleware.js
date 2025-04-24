export const adminMiddleware = (req, res) => {
  const { user } = req.session
  if (!user) {
    return res.redirect('/login')
  }
}
