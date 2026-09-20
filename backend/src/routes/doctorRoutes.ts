import { Router } from 'express';
import { searchDoctors, getDoctorById } from '../controllers/doctorController';

const router = Router();
router.get('/', searchDoctors);
router.get('/:id', getDoctorById);

export default router;