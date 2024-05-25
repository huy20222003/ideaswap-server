import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import ManagerAuthController from '../app/controllers/ManagerAuthController.mjs';

/**
 * @openapi
 * tags:
 *   name: ManagerAuth
 *   description: Manager authentication endpoints
 */

/**
 * @openapi
 * /api/v1/admin/auth/login:
 *   post:
 *     summary: Manager login
 *     tags: [ManagerAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/login', ManagerAuthController.login);

/**
 * @openapi
 * /api/v1/admin/auth/account:
 *   get:
 *     summary: Get manager account
 *     tags: [ManagerAuth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Manager profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/account', authVerify, casbinMiddleware, ManagerAuthController.getManagerProfile);

/**
 * @openapi
 * /api/v1/admin/auth/refresh:
 *   post:
 *     summary: Refresh manager token
 *     tags: [ManagerAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/refresh', ManagerAuthController.refreshToken);

export default router;