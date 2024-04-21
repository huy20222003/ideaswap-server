import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import CourseController from '../app/controllers/CourseController.mjs';
//-----------------------------------------------------------

router.get('/:_id', CourseController.getCourseById);
router.get('/', CourseController.getAllCourses);
router.post('/add-course', authVerify, casbinMiddleware, CourseController.addCourse);
router.delete('/delete-course/:_id', authVerify, casbinMiddleware, CourseController.deleteCourse);

export default router;