import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import BlogController from '../app/controllers/BlogController.mjs';

/**
 * @openapi
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */

/**
 * @openapi
 * /api/v1/blog/{_id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 url:
 *                   type: string
 *                 userID:
 *                   type: string
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get('/:_id', BlogController.getBlogById);

/**
 * @openapi
 * /api/v1/blog:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   url:
 *                     type: string
 *                   userID:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', BlogController.getAllBlogs);

/**
 * @openapi
 * /api/v1/blog/add:
 *   post:
 *     summary: Add a new blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - userID
 *               - content
 *             properties:
 *                 _id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 url:
 *                   type: string
 *                 userID:
 *                   type: string
 *     responses:
 *       201:
 *         description: Blog created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/add', authVerify, casbinMiddleware, BlogController.addBlog);

/**
 * @openapi
 * /api/v1/blog/update/{_id}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 _id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 url:
 *                   type: string
 *                 userID:
 *                   type: string
 *     responses:
 *       200:
 *         description: Blog updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.put('/update/:_id', authVerify, casbinMiddleware, BlogController.updateBlog);

/**
 * @openapi
 * /api/v1/blog/delete/{_id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:_id', authVerify, casbinMiddleware, BlogController.deleteBlog);

export default router;
