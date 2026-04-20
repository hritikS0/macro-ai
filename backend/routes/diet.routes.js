import { Router } from 'express';
import { DietController } from '../controllers/diet.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected by Supabase Auth
router.use(authenticateUser);

router.post('/generate', DietController.generate);
router.get('/active', DietController.getActivePlan);
router.post('/regenerate-meal', DietController.regenerate);
router.delete('/active', DietController.delete);
router.post('/chat', DietController.chat);
router.get('/chat/history', DietController.getChatHistory);
router.post('/export-pdf', DietController.exportPdf);


export default router;
