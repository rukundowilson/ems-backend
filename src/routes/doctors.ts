import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import * as doctorController from '../controllers/doctorController.js';
import * as DoctorModel from '../models/Doctor.js';

const router = Router();

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     tags: [Doctors]
 *     summary: Get all doctors
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     tags: [Doctors]
 *     summary: Get doctor by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor data
 *       404:
 *         description: Doctor not found
 */
router.get('/:id', doctorController.getDoctorById);

/**
 * @swagger
 * /api/doctors/{id}:
 *   patch:
 *     tags: [Doctors]
 *     summary: Update doctor (Admin only)
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
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: number
 *               qualification:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated
 *       404:
 *         description: Doctor not found
 */
router.patch('/:id', verifyToken, requireAdmin, doctorController.updateDoctor);

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     tags: [Doctors]
 *     summary: Delete doctor (Admin only)
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
 *         description: Doctor deleted
 *       404:
 *         description: Doctor not found
 */
router.delete('/:id', verifyToken, requireAdmin, doctorController.deleteDoctor);

/**
 * @swagger
 * /api/doctors/{id}/services:
 *   get:
 *     tags: [Doctors]
 *     summary: Get services assigned to a doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of services
 *       404:
 *         description: Doctor not found
 */
router.get('/:id/services', async (req, res) => {
  try {
    const { id } = req.params;
    const services = await DoctorModel.getServicesForDoctor(id);
    return res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    console.error('Error fetching doctor services:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

/**
 * @swagger
 * /api/doctors/{id}/services:
 *   post:
 *     tags: [Doctors]
 *     summary: Assign a service to a doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *             properties:
 *               serviceId:
 *                 type: string
 *                 description: Service ID to assign
 *     responses:
 *       200:
 *         description: Service assigned successfully
 *       400:
 *         description: Missing serviceId
 *       404:
 *         description: Doctor not found
 */
router.post('/:id/services', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceId } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'serviceId is required',
      });
    }

    const updatedDoctor = await DoctorModel.addServiceToDoctor(id, serviceId);

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    return res.json({
      success: true,
      data: updatedDoctor,
      message: 'Service assigned to doctor',
    });
  } catch (err) {
    console.error('Error assigning service:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

/**
 * @swagger
 * /api/doctors/{id}/services/{serviceId}:
 *   delete:
 *     tags: [Doctors]
 *     summary: Remove a service from a doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service removed successfully
 *       404:
 *         description: Doctor not found
 */
router.delete('/:id/services/:serviceId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id, serviceId } = req.params;

    const updatedDoctor = await DoctorModel.removeServiceFromDoctor(id, serviceId);

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    return res.json({
      success: true,
      data: updatedDoctor,
      message: 'Service removed from doctor',
    });
  } catch (err) {
    console.error('Error removing service:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message,
    });
  }
});

export default router;
