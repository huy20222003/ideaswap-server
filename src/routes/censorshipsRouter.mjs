import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import CensorshipsController from '../app/controllers/CensorshipsController.mjs';
//-----------------------------------------------------------

router.get('/', CensorshipsController.getAllCensorships);
router.put('/update', authVerify, casbinMiddleware, CensorshipsController.updateCensorship);

export default router;