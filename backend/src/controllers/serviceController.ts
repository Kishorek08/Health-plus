import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.medicalService.findMany({
      include: {
        doctors: {
          include: {
            doctor: {
              include: {
                user: { select: { fullName: true } },
              },
            },
          },
        },
      },
    });
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch medical services' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, category, description, baseFee } = req.body;
    const service = await prisma.medicalService.create({
      data: { name, category, description, baseFee: parseFloat(baseFee) },
    });
    return res.status(201).json(service);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Could not create service' });
  }
};