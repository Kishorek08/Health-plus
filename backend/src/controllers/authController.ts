import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
 // Import Zod directly instead of importing from utils

const prisma = new PrismaClient();

// Define validation schema directly here
const registerSchema = z.object({
  fullName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional(),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  specialty: z.string().optional(),
  hospitalAddress: z.string().optional(),
  hospital: z.string().optional(),
  qualification: z.string().optional(),
  experienceYears: z.any().optional(),
  consultationFee: z.any().optional(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.fullName || data.name || '',
        role: data.role || 'PATIENT',
        phone: data.phone,
        ...(data.role === 'DOCTOR' && {
          doctorProfile: {
            create: {
              specialization: data.specialization || data.specialty || 'General Medicine',
              hospital: data.hospitalAddress || data.hospital || 'Main Clinic',
            },
          },
        }),
      },
      include: {
        doctorProfile: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to register user.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { doctorProfile: true },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to log in.' });
  }
};