import express from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', ProfileController.get);
router.post('/', ProfileController.update);
router.get('/history', ProfileController.getWeightHistory);

export default router;
