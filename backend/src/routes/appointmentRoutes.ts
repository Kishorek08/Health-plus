import { Router } from 'express';
import { createAppointment, getUserAppointments, updateAppointmentStatus } from '../controllers/appointmentController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.post('/', createAppointment);
router.get('/', getUserAppointments);
router.patch('/:id/status', updateAppointmentStatus);

export default router;