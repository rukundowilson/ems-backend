import { Router } from 'express';
<<<<<<< Updated upstream
import * as BookingModel from '../models/Booking.js';

const router = Router();

// POST /api/bookings - Create a new booking (no auth required)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { doctorId, patientId, service, date, time, patientEmail, patientName, patientPhone, paymentMethod, amount } = req.body as {
      doctorId?: string;
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

    if (!doctorId || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'doctorId, service, date, and time are required',
      });
    }

    const booking = await BookingModel.createBooking({
      doctorId,
      patientId: patientId || undefined,
      service,
      date,
      time,
      patientEmail,
      patientName,
      patientPhone,
      paymentMethod,
      amount,
      status: 'pending',
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

// GET /api/bookings - Get all bookings for a patient or doctor
router.get('/', async (req: Request, res: Response) => {
  try {
    const patientId = req.query.patientId as string;
    const doctorId = req.query.doctorId as string;

    let bookings;
    if (patientId) {
      bookings = await BookingModel.getBookingsByPatient(patientId);
    } else if (doctorId) {
      bookings = await BookingModel.getBookingsByDoctor(doctorId);
    } else {
      bookings = await BookingModel.getAllBookings();
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

    const booking = await BookingModel.getBookingById(id);
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

    const updates: any = {};
    if (date) updates.date = date;
    if (time) updates.time = time;
    if (status) updates.status = status;

    const updated = await BookingModel.updateBooking(id, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    return res.json({
      success: true,
      data: updated,
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

    const deleted = await BookingModel.deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    return res.json({
      success: true,
      message: 'Booking deleted',
    });
  } catch (err) {
    console.error('Delete booking error:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});
=======
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import * as bookingController from '../controllers/bookingController.js';

const router = Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Get all bookings (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/', verifyToken, requireAdmin, bookingController.getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking data
 *       404:
 *         description: Booking not found
 */
router.get('/:id', verifyToken, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/doctor/{doctorId}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get bookings by doctor ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/doctor/:doctorId', verifyToken, bookingController.getBookingsByDoctor);

/**
 * @swagger
 * /api/bookings/patient/{patientId}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get bookings by patient ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/patient/:patientId', verifyToken, bookingController.getBookingsByPatient);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - serviceId
 *               - date
 *               - time
 *             properties:
 *               doctorId:
 *                 type: string
 *               patientId:
 *                 type: string
 *               serviceId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *               patientEmail:
 *                 type: string
 *               patientName:
 *                 type: string
 *               patientPhone:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     tags: [Bookings]
 *     summary: Update booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *               patientId:
 *                 type: string
 *               serviceId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *               patientEmail:
 *                 type: string
 *               patientName:
 *                 type: string
 *               patientPhone:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Booking updated
 *       404:
 *         description: Booking not found
 */
router.patch('/:id', verifyToken, bookingController.updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     tags: [Bookings]
 *     summary: Delete booking (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', verifyToken, requireAdmin, bookingController.deleteBooking);
>>>>>>> Stashed changes

export default router;
