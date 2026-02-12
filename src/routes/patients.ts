import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import * as patientController from '../controllers/patientController.js';

const router = Router();

/**
 * @swagger
 * /api/patients:
 *   get:
 *     tags: [Patients]
 *     summary: Get all patients (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get('/', verifyToken, requireAdmin, patientController.getAllPatients);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Get patient by ID (Admin only)
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
 *         description: Patient data
 *       404:
 *         description: Patient not found
 */
router.get('/:id', verifyToken, requireAdmin, patientController.getPatientById);

/**
 * @swagger
 * /api/patients/{id}:
 *   patch:
 *     tags: [Patients]
 *     summary: Update patient (Admin only)
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
 *     responses:
 *       200:
 *         description: Patient updated
 *       404:
 *         description: Patient not found
 */
router.patch('/:id', verifyToken, requireAdmin, patientController.updatePatient);

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     tags: [Patients]
 *     summary: Delete patient (Admin only)
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
 *         description: Patient deleted
 *       404:
 *         description: Patient not found
 */
router.delete('/:id', verifyToken, requireAdmin, patientController.deletePatient);

export default router;
