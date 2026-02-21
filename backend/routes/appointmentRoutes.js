import express from "express";
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  updateStatus,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  rateAppointment,
  updateLiveLocation,
  getLiveTracking,
} from "../controllers/appointmentController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAppointments)
  .post(authorize("owner"), createAppointment);

router
  .route("/:id")
  .get(getAppointment)
  .put(authorize("doctor", "admin"), updateAppointment);

router.put("/:id/status", authorize("doctor", "admin"), updateStatus);
router.put("/:id/cancel", cancelAppointment);
router.put("/:id/confirm", authorize("doctor"), confirmAppointment);
router.put("/:id/complete", authorize("doctor"), completeAppointment);
router.put("/:id/rate", authorize("owner"), rateAppointment);

// Live tracking
router.put("/:id/location", authorize("doctor"), updateLiveLocation);
router.get("/:id/tracking", authorize("owner"), getLiveTracking);

export default router;
