import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import FollowController from '../app/controllers/FollowController.mjs';
//-----------------------------------------------------------

router.get('/', authVerify, casbinMiddleware, FollowController.getAllFollows);
router.post('/add', authVerify, casbinMiddleware, FollowController.addFollow);
router.delete('/delete', authVerify, casbinMiddleware, FollowController.deleteFollow);

export default router;