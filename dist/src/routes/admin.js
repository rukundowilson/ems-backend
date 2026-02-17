import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';
import * as doctorController from '../controllers/doctorController.js';
const router = Router();
// Apply authentication middleware to all admin routes
router.use(verifyToken);
router.use(requireAdmin);
/**
 * @swagger
 * /api/admin/patients:
 *   get:
 *     tags: [Admin - Patients]
 *     summary: Get all patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
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
 *                     $ref: '#/components/schemas/Patient'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */
router.get('/patients', adminController.getAllPatients);
/**
 * @swagger
 * /api/admin/patients/{id}:
 *   get:
 *     tags: [Admin - Patients]
 *     summary: Get patient by ID
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
router.get('/patients/:id', adminController.getPatientById);
/**
 * @swagger
 * /api/admin/patients/{id}:
 *   patch:
 *     tags: [Admin - Patients]
 *     summary: Update patient
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
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, admin]
 *     responses:
 *       200:
 *         description: Patient updated
 *       404:
 *         description: Patient not found
 */
router.patch('/patients/:id', adminController.updatePatient);
/**
 * @swagger
 * /api/admin/patients/{id}:
 *   delete:
 *     tags: [Admin - Patients]
 *     summary: Delete patient
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
router.delete('/patients/:id', adminController.deletePatient);
/**
 * @swagger
 * /api/admin/doctors:
 *   get:
 *     tags: [Admin - Doctors]
 *     summary: Get all doctors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/doctors', adminController.getAllDoctors);
/**
 * @swagger
 * /api/admin/doctors:
 *   post:
 *     tags: [Admin - Doctors]
 *     summary: Create a new doctor
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               specialization:
 *                 type: string
 *               title:
 *                 type: string
 *               availability:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created
 *       409:
 *         description: Email already exists
 */
router.post('/doctors', doctorController.createDoctor);
/**
 * @swagger
 * /api/admin/doctors/{id}:
 *   get:
 *     tags: [Admin - Doctors]
 *     summary: Get doctor by ID
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
 *         description: Doctor data
 *       404:
 *         description: Doctor not found
 */
router.get('/doctors/:id', doctorController.getDoctorById);
/**
 * @swagger
 * /api/admin/doctors/{id}:
 *   patch:
 *     tags: [Admin - Doctors]
 *     summary: Update doctor
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
 *               title:
 *                 type: string
 *               availability:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated
 *       404:
 *         description: Doctor not found
 */
router.patch('/doctors/:id', doctorController.updateDoctor);
/**
 * @swagger
 * /api/admin/doctors/{id}:
 *   delete:
 *     tags: [Admin - Doctors]
 *     summary: Delete doctor
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
router.delete('/doctors/:id', doctorController.deleteDoctor);
/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     tags: [Admin - Bookings]
 *     summary: Get all bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/bookings', adminController.getAllBookings);
/**
 * @swagger
 * /api/admin/services:
 *   get:
 *     tags: [Admin - Services]
 *     summary: Get all services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/services', adminController.getAllServices);
/**
 * @swagger
 * /api/admin/services/{id}:
 *   get:
 *     tags: [Admin - Services]
 *     summary: Get service by ID
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
 *         description: Service data
 *       404:
 *         description: Service not found
 */
router.get('/services/:id', adminController.getServiceById);
/**
 * @swagger
 * /api/admin/services:
 *   post:
 *     tags: [Admin - Services]
 *     summary: Create a new service
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created
 *       409:
 *         description: Service slug already exists
 */
router.post('/services', adminController.createService);
/**
 * @swagger
 * /api/admin/services/{id}:
 *   patch:
 *     tags: [Admin - Services]
 *     summary: Update service
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
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Service not found
 */
router.patch('/services/:id', adminController.updateService);
/**
 * @swagger
 * /api/admin/services/{id}:
 *   delete:
 *     tags: [Admin - Services]
 *     summary: Delete service
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
 *         description: Service deleted
 *       404:
 *         description: Service not found
 */
router.delete('/services/:id', adminController.deleteService);
/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     tags: [Admin - Bookings]
 *     summary: Get all bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/bookings', adminController.getAllBookings);
export default router;
//# sourceMappingURL=admin.js.map