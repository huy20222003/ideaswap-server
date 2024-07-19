import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import NotificationsController from '../app/controllers/NotificationsController.mjs';

//-----------------------------------------------------------

/**
 * @openapi
 * tags:
 *   name: Notifications
 *   description: Notification management endpoints
 */

/**
 * @openapi
 * /api/v1/notification/{:userId}:
 *   get:
 *     summary: Get notifications by userId
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
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
router.get(
  '/:userId',
  authVerify,
  casbinMiddleware,
  NotificationsController.getNotificationsByUserId
);

/**
 * @openapi
 * /api/v1/notification:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
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
router.get(
  '/',
  authVerify,
  casbinMiddleware,
  NotificationsController.getAllNotifications
);

/**
 * @openapi
 * /api/v1/notification/update:
 *   put:
 *     summary: Update notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification updated
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put('/update', NotificationsController.updateNotification);

export default router;
