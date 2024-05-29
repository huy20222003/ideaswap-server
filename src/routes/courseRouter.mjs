import { Router } from 'express';
const router = Router();
// verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
// controller
import CourseController from '../app/controllers/CourseController.mjs';

/**
 * @openapi
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 */

/**
 * @openapi
 * /api/v1/course/search:
 *   get:
 *     summary: Search courses
 *     tags: [Courses]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching courses
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
 *       500:
 *         description: Server error
 */
router.get('/search', CourseController.searchCourse);

/**
 * @openapi
 * /api/v1/course/{_id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course data
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
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/:_id', CourseController.getCourseById);

/**
 * @openapi
 * /api/v1/course:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
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
 *       500:
 *         description: Server error
 */
router.get('/', CourseController.getAllCourses);

/**
 * @openapi
 * /api/v1/course/add:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/add', authVerify, casbinMiddleware, CourseController.addCourse);

/**
 * @openapi
 * /api/v1/course/update/{_id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.put('/update/:_id', authVerify, casbinMiddleware, CourseController.updateCourse);

/**
 * @openapi
 * /api/v1/course/update/view/{_id}:
 *   put:
 *     summary: Update course view
 *     tags: [Courses]
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
 *               views:
 *                 type: number
 *     responses:
 *       200:
 *         description: Course view updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.put('/update/view/:_id', authVerify, casbinMiddleware, CourseController.updateView);

/**
 * @openapi
 * /api/v1/course/delete/{_id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
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
 *         description: Course deleted
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:_id', authVerify, casbinMiddleware, CourseController.deleteCourse);

export default router;
