import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getAllAppointments,
  suspendUser,
  deleteUser
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/doctors/pending', getPendingDoctors);
router.get('/appointments', getAllAppointments);

router.put('/doctors/:id/approve', approveDoctor);
router.put('/doctors/:id/reject', rejectDoctor);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);

export default router;
