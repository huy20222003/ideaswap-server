import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import DocumentController from '../app/controllers/DocumentController.mjs';
// multer
import upload from '../config/multer/index.mjs';

/**
 * @openapi
 * tags:
 *   name: Documents
 *   description: Document management endpoints
 */

/**
 * @openapi
 * /api/v1/document/search:
 *   get:
 *     summary: Search documents
 *     tags: [Documents]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   filePath:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/search', DocumentController.searchDocument);

/**
 * @openapi
 * /api/v1/document/{_id}:
 *   get:
 *     summary: Get document by ID
 *     tags: [Documents]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 filePath:
 *                   type: string
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get('/:_id', DocumentController.getDocumentById);

/**
 * @openapi
 * /api/v1/document:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   filePath:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', DocumentController.getAllDocuments);

/**
 * @openapi
 * /api/v1/document/add:
 *   post:
 *     summary: Add a new document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - file
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/add', authVerify, casbinMiddleware, upload.single('file'), DocumentController.addDocument);

/**
 * @openapi
 * /api/v1/document/delete/{_id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
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
 *         description: Document deleted
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:_id', authVerify, casbinMiddleware, DocumentController.deleteDocument);

/**
 * @openapi
 * /api/v1/document/update/{_id}:
 *   put:
 *     summary: Update a document
 *     tags: [Documents]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Document updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.put('/update/:_id', authVerify, casbinMiddleware, upload.single('file'), DocumentController.updateDocument);

export default router;
