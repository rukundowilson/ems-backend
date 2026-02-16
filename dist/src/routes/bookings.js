import { Router } from 'express';
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
export default router;
//# sourceMappingURL=bookings.js.map