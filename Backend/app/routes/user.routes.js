import express from 'express'
import * as userController from '../controllers/user.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'

const router = express.Router()

// All user routes require authentication
router.use(auth)

// GCC Admin can see everyone, others are scoped in controller
router.get('/', requireRole(['gcc_admin', 'sp_primary', 'client_admin']), userController.getUsers)

router.get('/:userId', userController.getUser)

// Creation gates
router.post('/', requireRole(['gcc_admin', 'sp_primary', 'client_admin']), userController.createUser)

router.patch('/:userId', requireRole(['gcc_admin', 'sp_primary', 'client_admin']), userController.updateUser)

router.delete('/:userId', requireRole(['gcc_admin', 'sp_primary', 'client_admin']), userController.deleteUser)

export default router
