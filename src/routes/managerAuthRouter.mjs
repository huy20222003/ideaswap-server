import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import ManagerAuthController from '../app/controllers/ManagerAuthController.mjs';
//-----------------------------------------------------------

router.post('/login', ManagerAuthController.login);
router.get('/account', authVerify, casbinMiddleware, ManagerAuthController.getManagerProfile);
router.post('/refresh', ManagerAuthController.refreshToken);

export default router;
