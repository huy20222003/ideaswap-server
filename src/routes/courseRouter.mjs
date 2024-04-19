import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import CourseController from '../app/controllers/CourseController.mjs';
//-----------------------------------------------------------

router.get('/', CourseController.getAllCourses);

export default router;