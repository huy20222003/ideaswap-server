import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import RoleController from '../app/controllers/RoleController.mjs';
//-----------------------------------------------------------

router.get('/:_id', authVerify, casbinMiddleware, RoleController.getRoleById);
router.get('/', authVerify, casbinMiddleware, RoleController.getAllRoles);

export default router;
