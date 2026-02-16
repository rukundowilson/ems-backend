import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as PatientModel from '../models/Patient.js';

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password, phone, role, specialization, title, availability, status } = req.body as { name?: string; email?: string; password?: string; phone?: string; role?: 'patient' | 'doctor' | 'admin'; specialization?: string; title?: string; availability?: string; status?: string };
    if (!email || !password) return res.status(400).json({ success: false, error: 'email and password required' });

    // prevent duplicate
    const existing = await PatientModel.getPatientByEmail(email);
    if (existing) return res.status(409).json({ success: false, error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    // Default role to 'patient' if not provided
    const userRole = role || 'patient';
    const created = await PatientModel.createPatient({ email, name, phone, passwordHash: hash, role: userRole, specialization, title, availability, status });

    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const token = jwt.sign({ sub: created._id?.toString(), email: created.email, role: created.role }, secret, { expiresIn: '7d' });

    return res.status(201).json({ success: true, data: created, token });
  } catch (err) {
    console.error('Auth signup error', err);
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ success: false, error: 'email and password required' });

    const patient = await PatientModel.getPatientByEmail(email);
    if (!patient || !patient.passwordHash) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, patient.passwordHash);
    if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const token = jwt.sign({ sub: patient._id?.toString(), email: patient.email, role: patient.role }, secret, { expiresIn: '7d' });

    return res.json({
      success: true,
      data: { ...patient, passwordHash: undefined },
      token,
    });
  } catch (err) {
    console.error('Auth login error', err);
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const user = await PatientModel.getPatientById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({
      success: true,
      data: { ...user, passwordHash: undefined },
    });
  } catch (err) {
    console.error('Get user error', err);
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
