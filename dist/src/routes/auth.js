import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as doctorController from '../controllers/doctorController.js';
const router = Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authController.me);
// Doctor creation with admin key
router.post('/create-doctor', doctorController.createDoctor);
export default router;
//# sourceMappingURL=auth.js.map