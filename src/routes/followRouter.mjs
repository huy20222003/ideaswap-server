import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import FollowController from '../app/controllers/FollowController.mjs';

/**
 * @openapi
 * tags:
 *   name: Follows
 *   description: Follow management endpoints
 */

/**
 * @openapi
 * /api/v1/follow:
 *   get:
 *     summary: Get all follows
 *     tags: [Follows]
 *     responses:
 *       200:
 *         description: List of follows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   followId:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', FollowController.getAllFollows);

/**
 * @openapi
 * /api/v1/follow/add:
 *   post:
 *     summary: Add a new follow
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - followId
 *             properties:
 *               userId:
 *                 type: string
 *               followId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Follow added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/add', authVerify, casbinMiddleware, FollowController.addFollow);

/**
 * @openapi
 * /api/v1/follow/delete:
 *   delete:
 *     summary: Delete a follow
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - followId
 *             properties:
 *               userId:
 *                 type: string
 *               followId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Follow deleted
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.delete('/delete', authVerify, casbinMiddleware, FollowController.deleteFollow);

export default router;
