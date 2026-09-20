import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { doctorId, appointmentDate, timeSlot, symptoms, notes } = req.body;

    const patient = await prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile required to book an appointment.' });
    }

    // Double booking check
    const existingSlot = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
    });

    if (existingSlot) {
      return res.status(400).json({ error: 'This time slot is already booked for this doctor.' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        symptoms,
        notes,
      },
      include: {
        doctor: { include: { user: { select: { fullName: true } } } },
      },
    });

    return res.status(201).json(appointment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to book appointment' });
  }
};

export const getUserAppointments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;

    if (role === 'PATIENT') {
      const patient = await prisma.patientProfile.findUnique({ where: { userId } });
      const appointments = await prisma.appointment.findMany({
        where: { patientId: patient?.id },
        include: {
          doctor: { include: { user: { select: { fullName: true, phone: true } } } },
        },
        orderBy: { appointmentDate: 'desc' },
      });
      return res.json(appointments);
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });
      const appointments = await prisma.appointment.findMany({
        where: { doctorId: doctor?.id },
        include: {
          patient: { include: { user: { select: { fullName: true, phone: true, email: true } } } },
        },
        orderBy: { appointmentDate: 'desc' },
      });
      return res.json(appointments);
    }

    const allAppointments = await prisma.appointment.findMany({
      include: {
        patient: { include: { user: { select: { fullName: true } } } },
        doctor: { include: { user: { select: { fullName: true } } } },
      },
    });
    return res.json(allAppointments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

export const updateAppointmentStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update appointment status' });
  }
};