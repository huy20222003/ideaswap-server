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
router.get('/', authVerify, casbinMiddleware, ShareController.getAllShares);

export default router;
