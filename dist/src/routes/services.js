import { Router } from 'express';
import * as serviceController from '../controllers/serviceController.js';
const router = Router();
// Create a new service
router.post('/', serviceController.createService);
// Get all services
router.get('/', serviceController.getAllServices);
// Get service by slug (more specific - must come before :id)
router.get('/slug/:slug', serviceController.getServiceBySlug);
// Get service by ID (less specific - comes after slug)
router.get('/:id', serviceController.getServiceById);
// Update service
router.patch('/:id', serviceController.updateService);
// Delete service
router.delete('/:id', serviceController.deleteService);
export default router;
//# sourceMappingURL=services.js.map