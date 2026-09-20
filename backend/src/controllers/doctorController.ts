import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/doctors - Fetch all registered doctors
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        doctorProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(doctors);
  } catch (error: any) {
    console.error('Error fetching all doctors:', error);
    return res.status(500).json({ error: 'Failed to fetch doctor list' });
  }
};

// GET /api/doctors/search - Search doctors with filter parameters
export const searchDoctors = async (req: Request, res: Response) => {
  try {
    const { specialty, specialization, name } = req.query;

    const querySpecialty = (specialty || specialization) ? String(specialty || specialization) : null;
    const queryName = name ? String(name) : null;

    const doctors = await prisma.doctorProfile.findMany({
      where: {
        ...(querySpecialty
          ? {
              OR: [
                { specialization: { contains: querySpecialty, mode: 'insensitive' } },
                { specialty: { contains: querySpecialty, mode: 'insensitive' } },
              ] as any,
            }
          : {}),
        ...(queryName
          ? {
              user: {
                OR: [
                  { name: { contains: queryName, mode: 'insensitive' } },
                  { fullName: { contains: queryName, mode: 'insensitive' } },
                ] as any,
              },
            }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return res.json(doctors);
  } catch (error: any) {
    console.error('Error searching doctors:', error);

    // Safe fallback query directly on User table
    try {
      const fallbackDoctors = await prisma.user.findMany({
        where: {
          role: 'DOCTOR',
          ...(name ? { name: { contains: String(name), mode: 'insensitive' } } : {}),
        },
        include: {
          doctorProfile: true,
        },
      });
      return res.json(fallbackDoctors);
    } catch (fallbackErr) {
      return res.status(500).json({ error: 'Failed to search doctors' });
    }
  }
};

// GET /api/doctors/:id - Get specific doctor by ID
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Search by DoctorProfile ID first
    let doctor = await prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // If not found by DoctorProfile ID, search by User ID
    if (!doctor) {
      const userDoctor = await prisma.user.findFirst({
        where: { id, role: 'DOCTOR' },
        include: { doctorProfile: true },
      });

      if (userDoctor) {
        return res.json(userDoctor);
      }

      return res.status(404).json({ error: 'Doctor not found' });
    }

    return res.json(doctor);
  } catch (error: any) {
    console.error('Error fetching doctor details:', error);
    return res.status(500).json({ error: 'Error fetching doctor details' });
  }
};