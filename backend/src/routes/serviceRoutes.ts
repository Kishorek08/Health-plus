import { Router } from 'express';
import { getAllServices, createService } from '../controllers/serviceController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();
router.get('/', getAllServices);
router.post('/', authenticate, authorizeRoles('ADMIN'), createService);

export default router;