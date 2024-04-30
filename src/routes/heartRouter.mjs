import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import HeartController from '../app/controllers/HeartController.mjs';
//-----------------------------------------------------------

router.get('/', HeartController.getAllHearts);
router.post('/add', authVerify, casbinMiddleware, HeartController.addHeart);
router.delete('/delete', authVerify, casbinMiddleware, HeartController.deleteHeart);

export default router;