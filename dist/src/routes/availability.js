import { Router } from 'express';
import * as AvailabilityModel from '../models/Availability.js';
const router = Router();
/**
 * @swagger
 * /api/availability:
 *   get:
 *     tags: [Availability]
 *     summary: Get availability slots
 *     parameters:
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *         description: Service ID or slug
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: List of availability slots
 */
router.get('/', async (req, res) => {
    try {
        const doctorId = req.firebase?.uid || req.query.doctorId || 'doctor-1';
        const slots = await AvailabilityModel.getDoctorAvailability(doctorId);
        res.json({ success: true, data: slots });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * @swagger
 * /api/availability/{date}:
 *   get:
 *     tags: [Availability]
 *     summary: Get availability for specific date
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Date in YYYY-MM-DD format
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability slots for date
 */
router.get('/:date', async (req, res) => {
    try {
        const doctorId = req.firebase?.uid || req.query.doctorId || 'doctor-1';
        const date = req.params.date || '';
        if (!date)
            return res.status(400).json({ success: false, error: 'date required' });
        const slots = await AvailabilityModel.getAvailabilityByDate(doctorId, date);
        res.json({ success: true, data: slots });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * @swagger
 * /api/availability:
 *   post:
 *     tags: [Availability]
 *     summary: Create availability slots
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - slots
 *             properties:
 *               date:
 *                 type: string
 *                 description: Date in YYYY-MM-DD format
 *               slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       description: Start time HH:MM
 *                     end:
 *                       type: string
 *                       description: End time HH:MM
 *     responses:
 *       201:
 *         description: Slots created
 *       409:
 *         description: Time conflict
 */
router.post('/', async (req, res) => {
    try {
        const doctorId = req.firebase?.uid || req.query.doctorId || 'doctor-1';
        const { date, slots } = req.body;
        if (!date || !slots || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ success: false, error: 'date and slots array required' });
        }
        // Check for conflicts
        const existingSlots = await AvailabilityModel.getAvailabilityByDate(doctorId, date);
        for (const newSlot of slots) {
            for (const existing of existingSlots) {
                if (newSlot.start < existing.end && existing.start < newSlot.end) {
                    return res.status(409).json({ success: false, error: `Conflict: ${newSlot.start}-${newSlot.end} overlaps with existing ${existing.start}-${existing.end}` });
                }
            }
        }
        const created = await AvailabilityModel.createBulkAvailability(doctorId, slots.map((s) => ({ date, start: s.start, end: s.end })));
        res.status(201).json({ success: true, data: created });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * @swagger
 * /api/availability/{id}:
 *   patch:
 *     tags: [Availability]
 *     summary: Update availability slot
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
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Slot updated
 *       404:
 *         description: Slot not found
 */
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id || '';
        if (!id)
            return res.status(400).json({ success: false, error: 'id required' });
        const { start, end, date } = req.body;
        const updates = {};
        if (start !== undefined)
            updates.start = start;
        if (end !== undefined)
            updates.end = end;
        if (date !== undefined)
            updates.date = date;
        const updated = await AvailabilityModel.updateAvailability(id, updates);
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Slot not found' });
        }
        res.json({ success: true, data: updated });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
/**
 * @swagger
 * /api/availability/{id}:
 *   delete:
 *     tags: [Availability]
 *     summary: Delete availability slot
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slot deleted
 *       404:
 *         description: Slot not found
 */
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id || '';
        if (!id)
            return res.status(400).json({ success: false, error: 'id required' });
        const deleted = await AvailabilityModel.deleteAvailability(id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Slot not found' });
        }
        res.json({ success: true, message: 'Slot deleted' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// DELETE /api/availability - Delete all slots for a date
router.delete('/', async (req, res) => {
    try {
        const doctorId = req.firebase?.uid || req.query.doctorId || 'doctor-1';
        const { date } = req.body;
        if (!date) {
            return res.status(400).json({ success: false, error: 'date required' });
        }
        const count = await AvailabilityModel.deleteAvailabilityByDate(doctorId, date);
        res.json({ success: true, message: `${count} slots deleted` });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
export default router;
//# sourceMappingURL=availability.js.map