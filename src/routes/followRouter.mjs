import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import FollowController from '../app/controllers/FollowController.mjs';
//-----------------------------------------------------------

router.get('/', authVerify, casbinMiddleware, FollowController.getAllFollows);

export default router;