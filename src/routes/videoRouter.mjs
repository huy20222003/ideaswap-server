import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import VideoController from '../app/controllers/VideoController.mjs';
//-----------------------------------------------------------

/**
 * @openapi
 * tags:
 *   name: Videos
 *   description: Video management endpoints
 */

/**
 * @openapi
 * /api/v1/video/{_id}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Videos]
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
 *         description: Video data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.get('/:_id', VideoController.getVideoById);

/**
 * @openapi
 * /api/v1/video:
 *   get:
 *     summary: Get all videos
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', VideoController.getAllVideos);

/**
 * @openapi
 * /api/v1/video/add:
 *   post:
 *     summary: Add a new video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Video added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/add', authVerify, casbinMiddleware, VideoController.addVideo);

/**
 * @openapi
 * /api/v1/video/update/{_id}:
 *   put:
 *     summary: Update a video
 *     tags: [Videos]
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
 *     responses:
 *       200:
 *         description: Video updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.put('/update/:_id', authVerify, casbinMiddleware, VideoController.updateVideo);

/**
 * @openapi
 * /api/v1/video/update/view/{_id}:
 *   put:
 *     summary: Update video view count
 *     tags: [Videos]
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
 *         description: Video view count updated
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.put('/update/view/:_id', authVerify, casbinMiddleware, VideoController.updateView);

/**
 * @openapi
 * /api/v1/video/delete/{_id}:
 *   delete:
 *     summary: Delete a video
 *     tags: [Videos]
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
 *         description: Video deleted
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:_id', authVerify, casbinMiddleware, VideoController.deleteVideo);

export default router;
