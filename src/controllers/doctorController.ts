import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as PatientModel from '../models/Patient.js';

const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-key-change-in-production';

export async function createDoctor(req: Request, res: Response) {
  try {
    const { adminKey, email, name, phone, password } = req.body as {
      adminKey?: string;
      email?: string;
      name?: string;
      phone?: string;
      password?: string;
    };

    // Validate admin key
    if (!adminKey || adminKey !== ADMIN_KEY) {
      return res
        .status(403)
        .json({ success: false, error: 'Invalid admin key' });
    }

    if (!email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          error: 'email and password required',
        });
    }

    // Check if doctor already exists
    const existing = await PatientModel.getPatientByEmail(email);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: 'Doctor email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const created = await PatientModel.createPatient({
      email,
      name: name || '',
      phone: phone || '',
      passwordHash: hash,
      role: 'doctor',
    });

    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const token = jwt.sign(
      { sub: created._id?.toString(), email: created.email, role: 'doctor' },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ success: true, data: created, token });
  } catch (err) {
    console.error('Doctor creation error', err);
    return res
      .status(500)
      .json({ success: false, error: (err as Error).message });
  }
}
