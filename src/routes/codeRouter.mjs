import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import CodeController from '../app/controllers/CodeController.mjs';

/**
 * @openapi
 * tags:
 *   name: Codes
 *   description: Code management endpoints
 */

/**
 * @openapi
 * /api/v1/code/send:
 *   post:
 *     summary: Send a code
 *     tags: [Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code sent successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/send', authVerify, casbinMiddleware, CodeController.sendCode);

/**
 * @openapi
 * /api/v1/code/verify:
 *   post:
 *     summary: Verify a code
 *     tags: [Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - code
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/verify', authVerify, casbinMiddleware, CodeController.verifyCode);

export default router;
