import * as PatientModel from '../models/Patient.js';
import * as ServiceModel from '../models/Service.js';
import * as BookingModel from '../models/Booking.js';
// ========== PATIENT MANAGEMENT ==========
export async function getAllPatients(req, res) {
    try {
        const patients = await PatientModel.getAllPatients();
        const sanitized = patients.map(p => ({ ...p, passwordHash: undefined }));
        return res.json({ success: true, data: sanitized });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getPatientById(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const patient = await PatientModel.getPatientById(id);
        if (!patient)
            return res.status(404).json({ success: false, error: 'Patient not found' });
        const { passwordHash, ...sanitized } = patient;
        return res.json({ success: true, data: sanitized });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function updatePatient(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const { name, phone, email, role } = req.body;
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (phone !== undefined)
            updates.phone = phone;
        if (email !== undefined)
            updates.email = email;
        if (role !== undefined)
            updates.role = role;
        const updated = await PatientModel.updatePatient(id, updates);
        if (!updated)
            return res.status(404).json({ success: false, error: 'Patient not found' });
        const { passwordHash, ...sanitized } = updated;
        return res.json({ success: true, data: sanitized });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function deletePatient(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const deleted = await PatientModel.deletePatient(id);
        if (!deleted)
            return res.status(404).json({ success: false, error: 'Patient not found' });
        return res.json({ success: true, message: 'Patient deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getAllDoctors(req, res) {
    try {
        const doctors = await PatientModel.getPatientsByRole('doctor');
        const sanitized = doctors.map(d => ({ ...d, passwordHash: undefined }));
        return res.json({ success: true, data: sanitized });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function createDoctor(req, res) {
    try {
        const { name, email, phone, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'email and password required' });
        }
        const existing = await PatientModel.getPatientByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, error: 'Email already exists' });
        }
        const bcrypt = await import('bcrypt');
        const hash = await bcrypt.default.hash(password, 10);
        const doctor = await PatientModel.createPatient({
            email,
            name,
            phone,
            passwordHash: hash,
            role: 'doctor',
        });
        const { passwordHash, ...sanitized } = doctor;
        return res.status(201).json({ success: true, data: sanitized });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
// ========== SERVICE MANAGEMENT ==========
export async function getAllServices(req, res) {
    try {
        const services = await ServiceModel.getAllServices();
        return res.json({ success: true, data: services });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getServiceById(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const service = await ServiceModel.getServiceById(id);
        if (!service)
            return res.status(404).json({ success: false, error: 'Service not found' });
        return res.json({ success: true, data: service });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function createService(req, res) {
    try {
        const { title, slug, description } = req.body;
        if (!title || !slug || !description) {
            return res.status(400).json({ success: false, error: 'title, slug, and description required' });
        }
        const existing = await ServiceModel.getServiceBySlug(slug);
        if (existing)
            return res.status(409).json({ success: false, error: 'Service slug already exists' });
        const created = await ServiceModel.createService({ title, slug, description });
        return res.status(201).json({ success: true, data: created });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function updateService(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const { title, slug, description } = req.body;
        if (slug) {
            const existing = await ServiceModel.getServiceBySlug(slug);
            if (existing && existing._id?.toString() !== id) {
                return res.status(409).json({ success: false, error: 'Service slug already exists' });
            }
        }
        const updates = {};
        if (title !== undefined)
            updates.title = title;
        if (slug !== undefined)
            updates.slug = slug;
        if (description !== undefined)
            updates.description = description;
        const updated = await ServiceModel.updateService(id, updates);
        if (!updated)
            return res.status(404).json({ success: false, error: 'Service not found' });
        return res.json({ success: true, data: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function deleteService(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const deleted = await ServiceModel.deleteService(id);
        if (!deleted)
            return res.status(404).json({ success: false, error: 'Service not found' });
        return res.json({ success: true, message: 'Service deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
// ========== BOOKING MANAGEMENT ==========
export async function getAllBookings(req, res) {
    try {
        const bookings = await BookingModel.getAllBookings();
        return res.json({ success: true, data: bookings });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=adminController.js.map