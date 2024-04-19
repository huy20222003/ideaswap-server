import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import HeartController from '../app/controllers/HeartController.mjs';
//-----------------------------------------------------------

router.get('/', HeartController.getAllHearts);

export default router;