import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import UserController from '../app/controllers/UserController.mjs';
//-----------------------------------------------------------

router.get('/', UserController.getAllUsers);
router.get('/:_id', UserController.getUserById);

export default router;