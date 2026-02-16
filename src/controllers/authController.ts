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
    const patientData: any = { email, name, phone, passwordHash: hash, role: userRole };
    if (specialization) patientData.specialization = specialization;
    if (title) patientData.title = title;
    if (availability) patientData.availability = availability;
    if (status) patientData.status = status;
    const created = await PatientModel.createPatient(patientData);

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
    return res.json({ success: true, data: patient, token });
  } catch (err) {
    console.error('Auth login error', err);
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const authHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ success: false, error: 'Authorization required' });

    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const decoded: any = jwt.verify(token, secret);
    const sub = decoded && decoded.sub;
    if (!sub) return res.status(401).json({ success: false, error: 'Invalid token' });

    const patient = await PatientModel.getPatientById(sub);
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
    return res.json({ success: true, data: patient });
  } catch (err) {
    console.error('Auth me error', err);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}
