import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import ManagerController from '../app/controllers/ManagerController.mjs';

/**
 * @openapi
 * tags:
 *   name: Managers
 *   description: Manager management endpoints
 */

/**
 * @openapi
 * /api/v1/manager/{_id}:
 *   get:
 *     summary: Get manager by ID
 *     tags: [Managers]
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
 *         description: Manager data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *       404:
 *         description: Manager not found
 *       500:
 *         description: Server error
 */
router.get('/:_id', authVerify, casbinMiddleware, ManagerController.getManagerById);

/**
 * @openapi
 * /api/v1/manager:
 *   get:
 *     summary: Get all managers
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of managers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', authVerify, casbinMiddleware, ManagerController.getAllManagers);

/**
 * @openapi
 * /api/v1/manager/add:
 *   post:
 *     summary: Add a new manager
 *     tags: [Managers]
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
 *         description: Manager added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/add', authVerify, casbinMiddleware, ManagerController.addManager);

/**
 * @openapi
 * /api/v1/manager/{_id}:
 *   put:
 *     summary: Update a manager
 *     tags: [Managers]
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
 *         description: Manager updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Manager not found
 *       500:
 *         description: Server error
 */
router.put('/update/:_id', authVerify, casbinMiddleware, ManagerController.updateManager);

/**
 * @openapi
 * /api/v1/manager/{_id}:
 *   delete:
 *     summary: Delete a manager
 *     tags: [Managers]
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
 *         description: Manager deleted
 *       404:
 *         description: Manager not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:_id', authVerify, casbinMiddleware, ManagerController.deleteManager);

export default router;

