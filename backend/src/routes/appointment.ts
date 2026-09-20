import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all doctors with profile details
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await prisma.doctorProfile.findMany({
      include: { user: { select: { name: true, email: true } } },
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const { patientId, doctorId, date, timeSlot, notes } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date,
        timeSlot,
        notes,
      },
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment status (Doctor action)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

export default router;