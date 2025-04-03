import express from 'express'
import { BranchesController } from '../controllers/branchesController.js'
import { BranchesModel } from '../models/branchesModel.js'

const router = express.Router()

const branchesController = new BranchesController({ branchesModel: BranchesModel })

router.get('/', branchesController.getAll)
router.get('/add', (req, res) => {
  res.render('branches/branches-add')
})
router.post('/', branchesController.create)
router.get('/edit/:id', branchesController.renderEditForm)
router.patch('/:id', branchesController.update)
router.delete('/:id', branchesController.delete)

export default router
