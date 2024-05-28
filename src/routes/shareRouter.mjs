import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import ShareController from '../app/controllers/ShareController.mjs';
//-----------------------------------------------------------

/**
 * @openapi
 * tags:
 *   name: Shares
 *   description: Share management endpoints
 */

/**
 * @openapi
 * /api/v1/share:
 *   get:
 *     summary: Get all shares
 *     tags: [Shares]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shares
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
router.get('/', ShareController.getAllShares);

/**
 * @openapi
 * /api/v1/share/add:
 *   post:
 *     summary: Add a new share
 *     tags: [Shares]
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
 *         description: Share added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/add', authVerify, casbinMiddleware, ShareController.addShare);

export default router;
