import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import ShareController from '../app/controllers/ShareController.mjs';
//-----------------------------------------------------------

router.get('/', ShareController.getAllShares);

export default router;