import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import DocumentController from '../app/controllers/DocumentController.mjs';
//multer
import upload from '../config/multer/index.mjs';
//-----------------------------------------------------------

router.get('/', DocumentController.getAllDocuments);
router.post('/add', authVerify, casbinMiddleware, upload.single('file'), DocumentController.addDocument);
router.delete('/delete/:_id', authVerify, casbinMiddleware, DocumentController.deleteDocument);

export default router;