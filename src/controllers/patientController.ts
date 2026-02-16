import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import * as PatientModel from '../models/Patient.js';

export async function getAllPatients(req: AuthRequest, res: Response) {
  try {
    const patients = await PatientModel.getPatientsByRole('patient');
    const sanitized = patients.map(p => ({ ...p, passwordHash: undefined }));
    return res.json({ success: true, data: sanitized });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function getPatientById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const patient = await PatientModel.getPatientById(id);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const { passwordHash, ...sanitized } = patient;
    return res.json({ success: true, data: sanitized });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function updatePatient(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const { name, phone, email } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;

    const updated = await PatientModel.updatePatient(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Patient not found' });

    const { passwordHash, ...sanitized } = updated;
    return res.json({ success: true, data: sanitized });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function deletePatient(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const deleted = await PatientModel.deletePatient(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Patient not found' });

    return res.json({ success: true, message: 'Patient deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
