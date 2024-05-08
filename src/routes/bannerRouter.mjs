import { Router } from 'express';
const router = Router();
//verify
import authVerify from '../middleware/authVerify.mjs';
import casbinMiddleware from '../middleware/casbinMiddleware.mjs';
//controller
import BannerController from '../app/controllers/BannerController.mjs';
//-----------------------------------------------------------

router.get('/:_id', BannerController.getBannerById);
router.get('/', BannerController.getAllBanners);
router.post('/add', authVerify, casbinMiddleware, BannerController.addBanner);
router.put('/update/:_id', authVerify, casbinMiddleware, BannerController.updateBanner);
router.delete('/delete/:_id', authVerify, casbinMiddleware, BannerController.deleteBanner);

export default router;