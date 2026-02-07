import { Router } from 'express';
import {
  createTreatmentService,
  getAllTreatmentServices,
  getTreatmentServiceById,
  updateTreatmentService,
  deleteTreatmentService
} from '../controllers/treatment.controller';

const router = Router();

/**
 * @swagger
 * /api/treatment-services:
 *   post:
 *     summary: Create a new treatment service
 *     tags: [Treatment Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - date
 *               - time
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Treatment service created successfully
 */
router.post('/', createTreatmentService);

/**
 * @swagger
 * /api/treatment-services:
 *   get:
 *     summary: Get all treatment services
 *     tags: [Treatment Services]
 *     responses:
 *       200:
 *         description: List of all treatment services
 */
router.get('/', getAllTreatmentServices);

/**
 * @swagger
 * /api/treatment-services/{id}:
 *   get:
 *     summary: Get treatment service by ID
 *     tags: [Treatment Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment service details
 *       404:
 *         description: Treatment service not found
 */
router.get('/:id', getTreatmentServiceById);

/**
 * @swagger
 * /api/treatment-services/{id}:
 *   patch:
 *     summary: Update treatment service
 *     tags: [Treatment Services]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Treatment service updated successfully
 *       404:
 *         description: Treatment service not found
 */
router.patch('/:id', updateTreatmentService);

/**
 * @swagger
 * /api/treatment-services/{id}:
 *   delete:
 *     summary: Delete treatment service
 *     tags: [Treatment Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment service deleted successfully
 *       404:
 *         description: Treatment service not found
 */
router.delete('/:id', deleteTreatmentService);

export default router;
