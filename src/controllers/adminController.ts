import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import * as PatientModel from '../models/Patient.js';
import * as ServiceModel from '../models/Service.js';
import * as BookingModel from '../models/Booking.js';

// ========== PATIENT MANAGEMENT ==========

export async function getAllPatients(req: AuthRequest, res: Response) {
  try {
    const patients = await PatientModel.getAllPatients();
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
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });

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

    const { name, phone, email, role } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;

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

export async function getAllDoctors(req: AuthRequest, res: Response) {
  try {
    const doctors = await PatientModel.getPatientsByRole('doctor');
    const sanitized = doctors.map(d => ({ ...d, passwordHash: undefined }));
    return res.json({ success: true, data: sanitized });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

// ========== SERVICE MANAGEMENT ==========

export async function getAllServices(req: AuthRequest, res: Response) {
  try {
    const services = await ServiceModel.getAllServices();
    return res.json({ success: true, data: services });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function getServiceById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const service = await ServiceModel.getServiceById(id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });

    return res.json({ success: true, data: service });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function createService(req: AuthRequest, res: Response) {
  try {
    const { title, slug, description } = req.body;
    if (!title || !slug || !description) {
      return res.status(400).json({ success: false, error: 'title, slug, and description required' });
    }

    const existing = await ServiceModel.getServiceBySlug(slug);
    if (existing) return res.status(409).json({ success: false, error: 'Service slug already exists' });

    const created = await ServiceModel.createService({ title, slug, description });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function updateService(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const { title, slug, description } = req.body;
    if (slug) {
      const existing = await ServiceModel.getServiceBySlug(slug);
      if (existing && existing._id?.toString() !== id) {
        return res.status(409).json({ success: false, error: 'Service slug already exists' });
      }
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (slug !== undefined) updates.slug = slug;
    if (description !== undefined) updates.description = description;

    const updated = await ServiceModel.updateService(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Service not found' });

    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function deleteService(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const deleted = await ServiceModel.deleteService(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Service not found' });

    return res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

// ========== BOOKING MANAGEMENT ==========

export async function getAllBookings(req: AuthRequest, res: Response) {
  try {
    const bookings = await BookingModel.getAllBookings();
    return res.json({ success: true, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
