import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import UserController from '../app/controllers/UserController.mjs';
//-----------------------------------------------------------

router.get('/:_id', UserController.getUserById);
router.get('/', UserController.getAllUsers);
router.put('/update/:_id', authVerify, casbinMiddleware, UserController.updateUser);

export default router;