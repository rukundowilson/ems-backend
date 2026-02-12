import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as PatientModel from '../models/Patient.js';
import * as DoctorModel from '../models/Doctor.js';
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-key-change-in-production';
export async function createDoctor(req, res) {
    try {
        const { adminKey, email, name, phone, password, specialization, experience, qualification } = req.body;
        if (!adminKey || adminKey !== ADMIN_KEY) {
            return res.status(403).json({ success: false, error: 'Invalid admin key' });
        }
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'email and password required' });
        }
        const existing = await PatientModel.getPatientByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, error: 'Doctor email already exists' });
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
        const token = jwt.sign({ sub: created._id?.toString(), email: created.email, role: 'doctor' }, secret, { expiresIn: '7d' });
        return res.status(201).json({ success: true, data: created, token });
    }
    catch (err) {
        console.error('Doctor creation error', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getAllDoctors(req, res) {
    try {
        const doctors = await DoctorModel.getAllDoctors();
        const sanitized = doctors.map(d => ({ ...d, passwordHash: undefined }));
        return res.json({ success: true, data: sanitized });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getDoctorById(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const doctor = await DoctorModel.getDoctorById(id);
        if (!doctor)
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        const { passwordHash, ...sanitized } = doctor;
        return res.json({ success: true, data: sanitized });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function updateDoctor(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const { name, phone, email, specialization, experience, qualification } = req.body;
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (phone !== undefined)
            updates.phone = phone;
        if (email !== undefined)
            updates.email = email;
        if (specialization !== undefined)
            updates.specialization = specialization;
        if (experience !== undefined)
            updates.experience = experience;
        if (qualification !== undefined)
            updates.qualification = qualification;
        const updated = await DoctorModel.updateDoctor(id, updates);
        if (!updated)
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        const { passwordHash, ...sanitized } = updated;
        return res.json({ success: true, data: sanitized });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function deleteDoctor(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'ID required' });
        const deleted = await DoctorModel.deleteDoctor(id);
        if (!deleted)
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        return res.json({ success: true, message: 'Doctor deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=doctorController.js.map