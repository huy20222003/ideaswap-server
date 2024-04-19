import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import VideoController from '../app/controllers/VideoController.mjs';
//-----------------------------------------------------------

router.get('/:_id', VideoController.getVideoById);
router.get('/', VideoController.getAllVideos);

export default router;