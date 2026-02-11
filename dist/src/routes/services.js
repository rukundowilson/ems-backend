import { Router } from 'express';
import * as serviceController from '../controllers/serviceController.js';
const router = Router();
// Create a new service
router.post('/', serviceController.createService);
// Get all services
router.get('/', serviceController.getAllServices);
// Get service by ID
router.get('/id/:id', serviceController.getServiceById);
// Get service by slug
router.get('/slug/:slug', serviceController.getServiceBySlug);
// Update service
router.patch('/:id', serviceController.updateService);
// Delete service
router.delete('/:id', serviceController.deleteService);
export default router;
//# sourceMappingURL=services.js.map