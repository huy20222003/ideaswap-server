import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import ManagerController from '../app/controllers/ManagerController.mjs';
//-----------------------------------------------------------

router.get('/:_id', authVerify, casbinMiddleware, ManagerController.getManagerById);
router.get('/', authVerify, casbinMiddleware, ManagerController.getAllManagers);
router.post('/add', authVerify, casbinMiddleware, ManagerController.addManager);
router.put('/update/:_id', authVerify, casbinMiddleware, ManagerController.updateManager);
router.delete('/delete/:_id', authVerify, casbinMiddleware, ManagerController.deleteManager);

export default router;
