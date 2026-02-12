import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import * as BookingModel from '../models/Booking.js';

export async function getAllBookings(req: AuthRequest, res: Response) {
  try {
    const bookings = await BookingModel.getAllBookings();
    return res.json({ success: true, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function getBookingById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const booking = await BookingModel.getBookingById(id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    return res.json({ success: true, data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function getBookingsByDoctor(req: AuthRequest, res: Response) {
  try {
    const doctorId = req.params.doctorId;
    if (!doctorId) return res.status(400).json({ success: false, error: 'Doctor ID required' });

    const bookings = await BookingModel.getBookingsByDoctor(doctorId);
    return res.json({ success: true, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function getBookingsByPatient(req: AuthRequest, res: Response) {
  try {
    const patientId = req.params.patientId;
    if (!patientId) return res.status(400).json({ success: false, error: 'Patient ID required' });

    const bookings = await BookingModel.getBookingsByPatient(patientId);
    return res.json({ success: true, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function createBooking(req: AuthRequest, res: Response) {
  try {
    const { doctorId, patientId, serviceId, date, time, status, patientEmail, patientName, patientPhone, paymentMethod, amount } = req.body;

    if (!doctorId || !serviceId || !date || !time) {
      return res.status(400).json({ success: false, error: 'doctorId, serviceId, date, and time are required' });
    }

    const booking = await BookingModel.createBooking({
      doctorId,
      patientId,
      serviceId,
      date,
      time,
      status: status || 'pending',
      patientEmail,
      patientName,
      patientPhone,
      paymentMethod,
      amount,
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function updateBooking(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const { doctorId, patientId, serviceId, date, time, status, patientEmail, patientName, patientPhone, paymentMethod, amount } = req.body;
    const updates: any = {};
    if (doctorId !== undefined) updates.doctorId = doctorId;
    if (patientId !== undefined) updates.patientId = patientId;
    if (serviceId !== undefined) updates.serviceId = serviceId;
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (status !== undefined) updates.status = status;
    if (patientEmail !== undefined) updates.patientEmail = patientEmail;
    if (patientName !== undefined) updates.patientName = patientName;
    if (patientPhone !== undefined) updates.patientPhone = patientPhone;
    if (paymentMethod !== undefined) updates.paymentMethod = paymentMethod;
    if (amount !== undefined) updates.amount = amount;

    const updated = await BookingModel.updateBooking(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Booking not found' });

    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

export async function deleteBooking(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, error: 'ID required' });

    const deleted = await BookingModel.deleteBooking(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Booking not found' });

    return res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
