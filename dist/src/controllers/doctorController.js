import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as PatientModel from '../models/Patient.js';
import * as DoctorModel from '../models/Doctor.js';
import * as ServiceModel from '../models/Service.js';
import { ObjectId } from 'mongodb';
export async function createDoctor(req, res) {
    try {
        const { email, name, phone, password, specialization, experience, qualification, title, availability, status } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'email and password required' });
        }
        const existing = await PatientModel.getPatientByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, error: 'Doctor email already exists' });
        }
        let serviceId;
        if (specialization) {
            let service = await ServiceModel.getServiceByTitle(specialization);
            if (!service) {
                const slug = specialization.toLowerCase().replace(/\s+/g, '-');
                service = await ServiceModel.createService({
                    title: specialization,
                    slug,
                    description: `${specialization} service`,
                });
            }
            serviceId = service._id?.toString();
        }
        const hash = await bcrypt.hash(password, 10);
        const patientData = {
            email,
            name: name || undefined,
            phone: phone || undefined,
            passwordHash: hash,
            role: 'doctor',
        };
        if (specialization)
            patientData.specialization = specialization;
        if (title)
            patientData.title = title;
        if (availability)
            patientData.availability = availability;
        if (status)
            patientData.status = status;
        if (serviceId)
            patientData.services = [serviceId];
        const created = await PatientModel.createPatient(patientData);
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
            return res.status(400).json({ success: false, error: 'id required' });
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
            return res.status(400).json({ success: false, error: 'id required' });
        const { name, phone, email, specialization, experience, qualification, services, title, availability, status } = req.body;
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (phone !== undefined)
            updates.phone = phone;
        if (email !== undefined)
            updates.email = email;
        if (experience !== undefined)
            updates.experience = experience;
        if (qualification !== undefined)
            updates.qualification = qualification;
        if (title !== undefined)
            updates.title = title;
        if (availability !== undefined)
            updates.availability = availability;
        if (status !== undefined)
            updates.status = status;
        if (specialization !== undefined) {
            updates.specialization = specialization;
            let service = await ServiceModel.getServiceByTitle(specialization);
            if (!service) {
                const slug = specialization.toLowerCase().replace(/\s+/g, '-');
                service = await ServiceModel.createService({
                    title: specialization,
                    slug,
                    description: `${specialization} service`,
                });
            }
            updates.services = [service._id?.toString()];
        }
        else if (services !== undefined) {
            updates.services = services;
        }
        const doctor = await DoctorModel.updateDoctor(id, updates);
        if (!doctor)
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        return res.json({ success: true, data: { ...doctor, passwordHash: undefined } });
    }
    catch (err) {
        console.error('Update doctor error', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function deleteDoctor(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ success: false, error: 'id required' });
        const result = await PatientModel.deletePatient(id);
        if (!result)
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        return res.json({ success: true, message: 'Doctor deleted successfully' });
    }
    catch (err) {
        console.error('Delete doctor error', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function updateDoctorProfile(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const updates = req.body;
        const doctor = await DoctorModel.updateDoctor(userId, updates);
        if (!doctor)
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        return res.json({ success: true, data: { ...doctor, passwordHash: undefined } });
    }
    catch (err) {
        console.error('Update doctor error', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getDoctorBookings(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const BookingModel = await import('../models/Booking.js');
        const bookings = await (await BookingModel.getBookingsCollection()).find({ doctorId: userId }).toArray();
        return res.json({ success: true, data: bookings });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function markBookingCompleted(req, res) {
    try {
        const userId = req.user?.sub;
        const bookingId = req.params.id;
        if (!userId || !bookingId) {
            return res.status(400).json({ success: false, error: 'userId and bookingId required' });
        }
        const BookingModel = await import('../models/Booking.js');
        const booking = await (await BookingModel.getBookingsCollection()).findOne({ _id: new ObjectId(bookingId), doctorId: userId });
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found or not authorized' });
        }
        const updated = await BookingModel.updateBooking(bookingId, {
            status: 'completed',
            updatedAt: new Date(),
        });
        return res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error('Mark completed error', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=doctorController.js.map