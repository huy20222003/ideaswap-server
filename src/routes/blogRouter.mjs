import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import BlogController from '../app/controllers/BlogController.mjs';
//-----------------------------------------------------------

router.get('/:_id', BlogController.getSingleBlog);
router.get('/', BlogController.getAllBlogs);
router.post('/add-blog', authVerify, casbinMiddleware,  BlogController.addBlog);
router.put('/update-blog/:_id', authVerify, casbinMiddleware, BlogController.updateBlog);

export default router;