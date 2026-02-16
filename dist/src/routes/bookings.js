import { Router } from 'express';
import { createBooking, getBookingById, getBookingsByPatientId, getBookingsByDoctorId, getAllBookings, updateBooking, deleteBooking } from '../models/Booking.js';
import { createCompletionLog, getDoctorCompletionStats, getCompletionLogsByDoctorId } from '../models/CompletionLog.js';
import { incrementDoctorCompletedAppointments } from '../models/Doctor.js';
import * as PatientModel from '../models/Patient.js';
import * as ServiceModel from '../models/Service.js';
import * as AvailabilityModel from '../models/Availability.js';
const router = Router();
// POST /api/bookings - Create a new booking (no auth required)
router.post('/', async (req, res) => {
    try {
        let doctorId = req.body.doctorId;
        const { patientId, service, date, time, patientEmail, patientName, patientPhone, paymentMethod, amount } = req.body;
        // DocotorId is optional - admin/doctor will assign later
        if (!service || !date || !time) {
            return res.status(400).json({
                success: false,
                error: 'service, date, and time are required',
            });
        }
        // If startTime/endTime are provided, validate against availability.
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        // Helper to check time inclusion: a <= b
        const timeLE = (a, b) => a <= b;
        if (startTime && endTime) {
            if (doctorId) {
                // Verify doctor has availability covering this range on the date
                const avail = await AvailabilityModel.getAvailabilityByDate(doctorId, date);
                const ok = avail.some((s) => s.start <= startTime && s.end >= endTime);
                if (!ok) {
                    return res.status(400).json({ success: false, error: 'Selected time is not available for this doctor' });
                }
            }
            else {
                // No doctor assigned: try to find a doctor for this service with matching availability
                // Find doctors who offer this service
                const doctors = await PatientModel.getPatientsByRole('doctor');
                let assignedDoctor = null;
                const normalize = (v) => (v || '').toString().trim().toLowerCase();
                const matchesServiceEntry = (entry, target) => {
                    if (!entry)
                        return false;
                    if (typeof entry === 'string') {
                        const e = normalize(entry);
                        const t = normalize(target);
                        if (e === t)
                            return true;
                        // also match if entry looks like an id and equals target
                        if (e === target)
                            return true;
                        return false;
                    }
                    if (typeof entry === 'object') {
                        // check common fields
                        const fields = ['title', 'name', 'slug', '_id', 'id'];
                        for (const f of fields) {
                            if (entry[f]) {
                                if (normalize(entry[f]) === normalize(target))
                                    return true;
                            }
                        }
                    }
                    return false;
                };
                for (const d of doctors) {
                    const svcList = Array.isArray(d.services) ? d.services : [];
                    const hasService = svcList.some((s) => matchesServiceEntry(s, service));
                    if (!hasService)
                        continue;
                    const avail = await AvailabilityModel.getAvailabilityByDate(String(d._id), date);
                    const ok = avail.some((s) => s.start <= startTime && s.end >= endTime);
                    if (ok) {
                        assignedDoctor = d;
                        break;
                    }
                }
                if (assignedDoctor) {
                    // assign doctorId for the booking
                    doctorId = String(assignedDoctor._id);
                }
                else {
                    // No matching doctor found, allow creating an unassigned booking
                    // (a doctor may have posted the exact slot; don't over-restrict)
                    console.warn('No doctor auto-assigned for service/time; creating unassigned booking');
                    // continue without doctorId
                }
            }
        }
        const booking = await createBooking({
            ...(doctorId && { doctorId }),
            ...(patientId && { patientId }),
            service,
            date,
            time,
            ...(patientEmail && { patientEmail }),
            ...(patientName && { patientName }),
            ...(patientPhone && { patientPhone }),
            ...(paymentMethod && { paymentMethod }),
            ...(amount && { amount }),
        });
        return res.status(201).json({
            success: true,
            data: booking,
            message: 'Booking created successfully',
        });
    }
    catch (err) {
        console.error('Booking creation error:', err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
// GET /api/bookings - Get all bookings for a patient or doctor, or by service, or all bookings
router.get('/', async (req, res) => {
    try {
        const patientId = req.query.patientId;
        const doctorId = req.query.doctorId;
        const service = req.query.service;
        let bookings;
        // If service is provided, fetch all bookings and filter by service
        if (service && !patientId && !doctorId) {
            const allBookings = await getAllBookings();
            bookings = allBookings.filter((b) => b.service === service);
        }
        else if (patientId) {
            bookings = await getBookingsByPatientId(patientId);
        }
        else if (doctorId) {
            // For doctor, fetch their assigned bookings + unassigned bookings for their services
            const doctor = await PatientModel.getPatientById(doctorId);
            // Get bookings assigned to this doctor
            const assignedBookings = await getBookingsByDoctorId(doctorId);
            let unassignedBookings = [];
            // If doctor has services, also get unassigned bookings for those services
            if (doctor && Array.isArray(doctor.services) && doctor.services.length > 0) {
                const serviceSet = new Set(doctor.services);
                const allBookings = await getAllBookings();
                unassignedBookings = allBookings.filter((b) => !b.doctorId && serviceSet.has(b.service));
            }
            // Combine assigned and unassigned bookings
            bookings = [...assignedBookings, ...unassignedBookings];
        }
        else {
            // If no parameters provided, return all bookings
            bookings = await getAllBookings();
        }
        // Enhance bookings with full service details
        const enhancedBookings = await Promise.all(bookings.map(async (booking) => {
            try {
                // Try to fetch service details using service ID
                const serviceDoc = await ServiceModel.getServiceById(booking.service);
                return {
                    ...booking,
                    serviceDetails: serviceDoc ? {
                        _id: serviceDoc._id,
                        title: serviceDoc.title,
                        slug: serviceDoc.slug,
                        description: serviceDoc.description,
                    } : null,
                };
            }
            catch (err) {
                // If service doesn't exist, keep booking as is
                return booking;
            }
        }));
        return res.json({
            success: true,
            data: enhancedBookings,
        });
    }
    catch (err) {
        console.error('Fetch bookings error:', err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
// GET /api/bookings/all - Get all bookings (for admin)
router.get('/all', async (req, res) => {
    try {
        const bookings = await getAllBookings();
        return res.json({
            success: true,
            data: bookings,
        });
    }
    catch (err) {
        console.error('Fetch all bookings error:', err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
// GET /api/bookings/:id - Get a specific booking
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id || '';
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'id is required',
            });
        }
        const booking = await getBookingById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found',
            });
        }
        return res.json({
            success: true,
            data: booking,
        });
    }
    catch (err) {
        console.error('Fetch booking error:', err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
// PATCH /api/bookings/:id - Update a booking
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id || '';
        const { date, time, status, doctorId, notes, rating } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'id is required',
            });
        }
        console.log('PATCH /bookings/:id - Attempting update:', { id, status, date, time, doctorId });
        // Get the booking first to check current status
        const currentBooking = await getBookingById(id);
        if (!currentBooking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found',
            });
        }
        const updateData = {};
        if (date !== undefined)
            updateData.date = date;
        if (time !== undefined)
            updateData.time = time;
        if (status !== undefined)
            updateData.status = status;
        // Handle completion tracking
        if (status === 'completed' && currentBooking.status !== 'completed') {
            // Mark when and by whom the appointment was completed
            updateData.completedAt = new Date();
            if (doctorId) {
                updateData.completedBy = doctorId;
            }
            console.log('Booking marked as completed:', { id, doctorId });
        }
        const booking = await updateBooking(id, updateData);
        if (!booking) {
            console.error('Booking not found for ID:', id);
            return res.status(404).json({
                success: false,
                error: 'Booking not found',
            });
        }
        // If status changed to completed, create completion log and update doctor stats
        if (status === 'completed' && currentBooking.status !== 'completed' && doctorId) {
            try {
                // Create completion log entry
                const logPayload = {
                    bookingId: id,
                    doctorId,
                    service: booking.service,
                    appointmentDate: booking.date,
                };
                if (booking.patientId)
                    logPayload.patientId = booking.patientId;
                if (booking.patientName)
                    logPayload.patientName = booking.patientName;
                if (notes)
                    logPayload.notes = notes;
                if (rating)
                    logPayload.rating = rating;
                await createCompletionLog(logPayload);
                // Update doctor's completion stats
                await incrementDoctorCompletedAppointments(doctorId, rating);
                console.log('Completion log created and doctor stats updated:', { id, doctorId });
            }
            catch (logErr) {
                console.error('Error creating completion log:', logErr);
                // Don't fail the request if logging fails, but log the error
            }
        }
        return res.json({
            success: true,
            data: booking,
            message: 'Booking updated successfully',
        });
    }
    catch (err) {
        console.error('Update booking error:', err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id || '';
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'id is required',
            });
        }
        const result = await deleteBooking(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found',
            });
        }
        return res.json({
            success: true,
            message: 'Booking cancelled successfully',
        });
    }
    catch (err) {
        console.error('Delete booking error:', err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
export default router;
// GET /api/bookings/completions/doctor/:doctorId - Get completion logs for a doctor
router.get('/completions/doctor/:doctorId', async (req, res) => {
    try {
        const doctorId = req.params.doctorId || '';
        if (!doctorId)
            return res.status(400).json({ success: false, error: 'doctorId required' });
        const logs = await getCompletionLogsByDoctorId(doctorId);
        return res.json({ success: true, data: logs });
    }
    catch (err) {
        console.error('Fetch completion logs error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});
//# sourceMappingURL=bookings.js.map