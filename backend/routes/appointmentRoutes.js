import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  rateAppointment
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(authorize('owner'), createAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment);

router.put('/:id/cancel', cancelAppointment);
router.put('/:id/confirm', authorize('doctor'), confirmAppointment);
router.put('/:id/complete', authorize('doctor'), completeAppointment);
router.put('/:id/rate', authorize('owner'), rateAppointment);

export default router;
