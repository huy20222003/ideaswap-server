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
router.post('/add-video', authVerify, casbinMiddleware, VideoController.addVideo);
router.delete('/delete-video/:_id', authVerify, casbinMiddleware, VideoController.deleteVideo);

export default router;