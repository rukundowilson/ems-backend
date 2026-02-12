import { Router } from 'express';
import { createBooking, getBookingById, getBookingsByPatientId, getBookingsByDoctorId, updateBooking, deleteBooking } from '../models/Booking.js';
const router = Router();
// POST /api/bookings - Create a new booking (no auth required)
router.post('/', async (req, res) => {
    try {
        const { doctorId, patientId, service, date, time, patientEmail, patientName, patientPhone, paymentMethod, amount } = req.body;
        if (!doctorId || !service || !date || !time) {
            return res.status(400).json({
                success: false,
                error: 'doctorId, service, date, and time are required',
            });
        }
        const booking = await createBooking({
            doctorId,
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
// GET /api/bookings - Get all bookings for a patient or doctor
router.get('/', async (req, res) => {
    try {
        const patientId = req.query.patientId;
        const doctorId = req.query.doctorId;
        if (!patientId && !doctorId) {
            return res.status(400).json({
                success: false,
                error: 'patientId or doctorId is required',
            });
        }
        let bookings;
        if (patientId) {
            bookings = await getBookingsByPatientId(patientId);
        }
        else {
            bookings = await getBookingsByDoctorId(doctorId);
        }
        return res.json({
            success: true,
            data: bookings,
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
        const { date, time, status } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'id is required',
            });
        }
        const updateData = {};
        if (date)
            updateData.date = date;
        if (time)
            updateData.time = time;
        if (status)
            updateData.status = status;
        const booking = await updateBooking(id, updateData);
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found',
            });
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
//# sourceMappingURL=bookings.js.map