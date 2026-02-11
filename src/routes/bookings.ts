import type { Request, Response } from 'express';
import { Router } from 'express';
import { createBooking, getBookingById, getBookingsByPatientId, getBookingsByDoctorId, getAllBookings, updateBooking, deleteBooking } from '../models/Booking.js';
import * as PatientModel from '../models/Patient.js';
import * as AvailabilityModel from '../models/Availability.js';

const router = Router();

// POST /api/bookings - Create a new booking (no auth required)
router.post('/', async (req: Request, res: Response) => {
  try {
    let doctorId = (req.body as any).doctorId as string | undefined;
    const { patientId, service, date, time, patientEmail, patientName, patientPhone, paymentMethod, amount } = req.body as {
      // doctorId is handled separately above
      patientId?: string;
      service?: string;
      date?: string;
      time?: string;
      patientEmail?: string;
      patientName?: string;
      patientPhone?: string;
      paymentMethod?: string;
      amount?: number;
    };

    // DocotorId is optional - admin/doctor will assign later
    if (!service || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'service, date, and time are required',
      });
    }

    // If startTime/endTime are provided, validate against availability.
    const startTime = req.body.startTime as string | undefined;
    const endTime = req.body.endTime as string | undefined;

    // Helper to check time inclusion: a <= b
    const timeLE = (a: string, b: string) => a <= b;

    if (startTime && endTime) {
      if (doctorId) {
        // Verify doctor has availability covering this range on the date
        const avail = await AvailabilityModel.getAvailabilityByDate(doctorId, date);
        const ok = avail.some((s: any) => s.start <= startTime && s.end >= endTime);
        if (!ok) {
          return res.status(400).json({ success: false, error: 'Selected time is not available for this doctor' });
        }
      } else {
        // No doctor assigned: try to find a doctor for this service with matching availability
        // Find doctors who offer this service
        const doctors = await PatientModel.getPatientsByRole('doctor');
        let assignedDoctor: any = null;
        const normalize = (v: any) => (v || '').toString().trim().toLowerCase();

        const matchesServiceEntry = (entry: any, target: string) => {
          if (!entry) return false;
          if (typeof entry === 'string') {
            const e = normalize(entry);
            const t = normalize(target);
            if (e === t) return true;
            // also match if entry looks like an id and equals target
            if (e === target) return true;
            return false;
          }
          if (typeof entry === 'object') {
            // check common fields
            const fields = ['title', 'name', 'slug', '_id', 'id'];
            for (const f of fields) {
              if ((entry as any)[f]) {
                if (normalize((entry as any)[f]) === normalize(target)) return true;
              }
            }
          }
          return false;
        };

        for (const d of doctors) {
          const svcList = Array.isArray(d.services) ? d.services : [];
          const hasService = svcList.some((s: any) => matchesServiceEntry(s, service));
          if (!hasService) continue;

          const avail = await AvailabilityModel.getAvailabilityByDate(String(d._id), date);
          const ok = avail.some((s: any) => s.start <= startTime && s.end >= endTime);
          if (ok) {
            assignedDoctor = d;
            break;
          }
        }

        if (assignedDoctor) {
          // assign doctorId for the booking
          doctorId = String(assignedDoctor._id);
        } else {
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
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

// GET /api/bookings - Get all bookings for a patient or doctor, or by service, or all bookings
router.get('/', async (req: Request, res: Response) => {
  try {
    const patientId = req.query.patientId as string;
    const doctorId = req.query.doctorId as string;
    const service = req.query.service as string;

    let bookings;
    
    // If service is provided, fetch all bookings and filter by service
    if (service && !patientId && !doctorId) {
      const allBookings = await getAllBookings();
      bookings = allBookings.filter((b: any) => b.service === service);
    } else if (patientId) {
      bookings = await getBookingsByPatientId(patientId);
    } else if (doctorId) {
      // For doctor, fetch their assigned bookings + unassigned bookings for their services
      const doctor = await PatientModel.getPatientById(doctorId);
      
      // Get bookings assigned to this doctor
      const assignedBookings = await getBookingsByDoctorId(doctorId);
      let unassignedBookings: any[] = [];
      
      // If doctor has services, also get unassigned bookings for those services
      if (doctor && Array.isArray(doctor.services) && doctor.services.length > 0) {
        const serviceSet = new Set(doctor.services);
        const allBookings = await getAllBookings();
        unassignedBookings = allBookings.filter((b: any) => 
          !b.doctorId && serviceSet.has(b.service)
        );
      }
      
      // Combine assigned and unassigned bookings
      bookings = [...assignedBookings, ...unassignedBookings];
    } else {
      // If no parameters provided, return all bookings
      bookings = await getAllBookings();
    }

    return res.json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    console.error('Fetch bookings error:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

// GET /api/bookings/:id - Get a specific booking
router.get('/:id', async (req: Request, res: Response) => {
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
  } catch (err) {
    console.error('Fetch booking error:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

// PATCH /api/bookings/:id - Update a booking
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id || '';
    const { date, time, status } = req.body as {
      date?: string;
      time?: string;
      status?: string;
    };

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'id is required',
      });
    }

    const updateData: any = {};
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (status) updateData.status = status;

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
  } catch (err) {
    console.error('Update booking error:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', async (req: Request, res: Response) => {
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
  } catch (err) {
    console.error('Delete booking error:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

export default router;
