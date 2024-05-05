import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import CodeController from '../app/controllers/CodeController.mjs';
//-----------------------------------------------------------

router.post('/send', authVerify, casbinMiddleware, CodeController.sendCode);
router.post('/verify', authVerify, casbinMiddleware, CodeController.verifyCode);

export default router;