import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import CommentController from '../app/controllers/CommentController.mjs';
//-----------------------------------------------------------

router.get('/', CommentController.getAllComments);

export default router;