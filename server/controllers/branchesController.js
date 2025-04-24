import { validateBranch, validatePartialBranch } from '../schemas/branches.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'

export class BranchesController {
  constructor ({ branchesModel }) {
    this.branchesModel = branchesModel
  }

  getAll = async (req, res) => {
    adminMiddleware(req, res)
    const branches = await this.branchesModel.getAll()
    res.render('branches/branches', { branches })
  }

  create = async (req, res) => {
    adminMiddleware(req, res)
    const result = validateBranch(req.body)
    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    await this.branchesModel.create({ input: result.data })
    res.redirect('/branches')
  }

  renderEditForm = async (req, res) => {
    adminMiddleware(req, res)
    const { id } = req.params
    const branch = await this.branchesModel.getById({ id })
    res.render('branches/branches-edit', { branch, currentPath: req.path })
  }

  update = async (req, res) => {
    adminMiddleware(req, res)
    const result = validatePartialBranch(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    await this.branchesModel.update({ id, input: result.data })

    res.redirect('/branches')
  }

  delete = async (req, res) => {
    adminMiddleware(req, res)
    const { id } = req.params
    const result = await this.branchesModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Branch not found' })
    }
    res.redirect('/branches')
  }
}
