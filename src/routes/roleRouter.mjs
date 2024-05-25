import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import RoleController from '../app/controllers/RoleController.mjs';
//-----------------------------------------------------------

/**
 * @openapi
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */

/**
 * @openapi
 * /api/v1/role/{_id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
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
 *         description: Role data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.get('/:_id', authVerify, casbinMiddleware, RoleController.getRoleById);

/**
 * @openapi
 * /api/v1/role:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
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
router.get('/', authVerify, casbinMiddleware, RoleController.getAllRoles);

export default router;
