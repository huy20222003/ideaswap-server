import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import BannerController from '../app/controllers/BannerController.mjs';
//-----------------------------------------------------------

/**
 * @openapi
 * tags:
 *   name: Banners
 *   description: Banner management endpoints
 */

/**
 * @openapi
 * /api/v1/banner/{_id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 site: 
 *                   type: string
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server Error
 */
router.get('/:_id', BannerController.getBannerById);

/**
 * @openapi
 * /api/v1/banner:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   site: 
 *                     type: string
 *         500:
 *           description: Server Error
 */
router.get('/', BannerController.getAllBanners);

/**
 * @openapi
 * /api/v1/banner/add:
 *   post:
 *     summary: Add a new banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - site
 *               - imageUrl
 *             properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 site: 
 *                   type: string
 *     responses:
 *       201:
 *         description: Banner created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 */
router.post('/add', authVerify, casbinMiddleware, BannerController.addBanner);

/**
 * @openapi
 * /api/v1/banner/update/{_id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banners]
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
 *             properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 site: 
 *                   type: string
 *     responses:
 *       200:
 *         description: Banner updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server Error
 */
router.put('/update/:_id', authVerify, casbinMiddleware, BannerController.updateBanner);

/**
 * @openapi
 * /api/v1/banner/delete/{_id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
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
 *         description: Banner deleted
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server Error
 */
router.delete('/delete/:_id', authVerify, casbinMiddleware, BannerController.deleteBanner);
export default router;