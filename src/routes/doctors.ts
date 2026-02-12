import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import * as doctorController from '../controllers/doctorController.js';

const router = Router();

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     tags: [Doctors]
 *     summary: Create a new doctor (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: number
 *               qualification:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created
 *       403:
 *         description: Admin access required
 */
router.post('/', verifyToken, requireAdmin, doctorController.createDoctor);

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

export default router;
