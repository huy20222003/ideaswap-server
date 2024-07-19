import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import ConversationController from '../app/controllers/ConversationController.mjs';

/**
 * @openapi
 * tags:
 *   name: Conversations
 *   description: Conversation management endpoints
 */

/**
 * @openapi
 * /api/v1/conversation/{userId}:
 *   get:
 *     summary: Get Conversations by user ID
 *     tags: [Conversations]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:userId',
  authVerify,
  casbinMiddleware,
  ConversationController.getConversationsByUserId
);

/**
 * @openapi
 * /api/v1/conversation/id/{_id}:
 *   get:
 *     summary: Get conversation by _id
 *     tags: [Conversations]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get conversation by _id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Server error
 */
router.get(
  '/get-by-id/:_id',
  authVerify,
  casbinMiddleware,
  ConversationController.getOneConversation
);

/**
 * @openapi
 * /api/v1/conversation:
 *   get:
 *     summary: Get all conversations
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: List of conversations
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
  '/',
  authVerify,
  casbinMiddleware,
  ConversationController.getAllConversations
);

/**
 * @openapi
 * /api/v1/conversation/add:
 *   post:
 *     summary: Add conversation
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: Add conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error
 */
router.post(
  '/add',
  authVerify,
  casbinMiddleware,
  ConversationController.addConversation
);

/**
 * @openapi
 * /api/v1/conversation/delete/{:_id}:
 *   post:
 *     summary: Delete conversation
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: Delete conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error
 */
router.delete(
  '/delete/:_id',
  authVerify,
  casbinMiddleware,
  ConversationController.deleteConversation
);

export default router;
