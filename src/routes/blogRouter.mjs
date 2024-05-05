import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import BlogController from '../app/controllers/BlogController.mjs';
//-----------------------------------------------------------

router.get('/:_id', BlogController.getBlogById);
router.get('/', BlogController.getAllBlogs);
router.post('/add', authVerify, casbinMiddleware,  BlogController.addBlog);
router.put('/update/:_id', authVerify, casbinMiddleware, BlogController.updateBlog);
router.delete('/delete/:_id', authVerify, casbinMiddleware, BlogController.deleteBlog);

export default router;