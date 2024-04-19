import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import AuthController from '../app/controllers/AuthController.mjs';
//-----------------------------------------------------------

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/account', authVerify, casbinMiddleware, AuthController.getUserProfile);
router.post('/refresh', AuthController.refreshToken);


export default router;
