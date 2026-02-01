import express from 'express';
import {
  getDoctors,
  getDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  updateAvailability,
  getDoctorStats
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctor);

router.get('/profile/me', protect, authorize('doctor'), getDoctorProfile);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);
router.get('/stats/me', protect, authorize('doctor'), getDoctorStats);

export default router;
