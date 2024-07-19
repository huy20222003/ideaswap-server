import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import MessageController from '../app/controllers/MessageController.mjs';

/**
 * @openapi
 * tags:
 *   name: Messages
 *   description: Message management endpoints
 */

/**
 * @openapi
 * /api/v1/message:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get('/', authVerify, casbinMiddleware, MessageController.getAllMessages);

/**
 * @openapi
 * /api/v1/message/{:conversationId}:
 *   get:
 *     summary: Get messages by conversationId
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get(
  '/:conversationId',
  authVerify,
  casbinMiddleware,
  MessageController.getMessagesByConversationId
);

export default router;
