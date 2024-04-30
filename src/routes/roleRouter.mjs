import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import RoleController from '../app/controllers/RoleController.mjs';
//-----------------------------------------------------------

router.get('/:_id', RoleController.getRoleById);

export default router;
