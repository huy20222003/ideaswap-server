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
router.post('/add', authVerify, casbinMiddleware, VideoController.addVideo);
router.put('/update/:_id', authVerify, casbinMiddleware, VideoController.updateVideo);
router.put('/update/view/:_id', authVerify, casbinMiddleware, VideoController.updateView);
router.delete('/delete/:_id', authVerify, casbinMiddleware, VideoController.deleteVideo);

export default router;