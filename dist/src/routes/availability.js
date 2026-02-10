import { Router } from 'express';
import * as AvailabilityModel from '../models/Availability.js';
const router = Router();
// GET /api/availability - Get all availability slots for current doctor
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
// GET /api/availability/:date - Get availability for specific date
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
// POST /api/availability - Create single or multiple availability slots
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
// PUT /api/availability/:id - Update availability slot
router.put('/:id', async (req, res) => {
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
// DELETE /api/availability/:id - Delete availability slot
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