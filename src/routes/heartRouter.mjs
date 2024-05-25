import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import HeartController from '../app/controllers/HeartController.mjs';

/**
 * @openapi
 * tags:
 *   name: Hearts
 *   description: Heart management endpoints
 */

/**
 * @openapi
 * /api/v1/heart:
 *   get:
 *     summary: Get all hearts
 *     tags: [Hearts]
 *     responses:
 *       200:
 *         description: List of hearts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   heartId:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', HeartController.getAllHearts);

/**
 * @openapi
 * /api/v1/heart/add:
 *   post:
 *     summary: Add a new heart
 *     tags: [Hearts]
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
 *               - heartId
 *             properties:
 *               userId:
 *                 type: string
 *               heartId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Heart added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/add', authVerify, casbinMiddleware, HeartController.addHeart);

/**
 * @openapi
 * /api/v1/heart/delete:
 *   delete:
 *     summary: Delete a heart
 *     tags: [Hearts]
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
 *               - heartId
 *             properties:
 *               userId:
 *                 type: string
 *               heartId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Heart deleted
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.delete('/delete', authVerify, casbinMiddleware, HeartController.deleteHeart);

export default router;
