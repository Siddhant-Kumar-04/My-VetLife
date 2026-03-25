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
  deletePendingPaymentAppointment,
  getDoctorReviews,
} from "../controllers/appointmentController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public route to get booked slots for a doctor (no auth required)
router.get("/doctor/:doctorId/booked-slots", async (req, res, next) => {
  try {
    const Appointment = (await import("../models/Appointment.js")).default;
    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
      status: { $nin: ["cancelled", "pending_payment"] }
    }).select("appointmentDate appointmentTime");
    
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
});

// Public route to get reviews for a doctor (no auth required)
router.get("/doctor/:doctorId/reviews", getDoctorReviews);

// All routes below require authentication
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
router.delete("/:id/cancel-payment", authorize("owner"), deletePendingPaymentAppointment);
router.put("/:id/confirm", authorize("doctor"), confirmAppointment);
router.put("/:id/complete", authorize("doctor"), completeAppointment);
router.put("/:id/rate", authorize("owner"), rateAppointment);

// Live tracking
router.put("/:id/location", authorize("doctor"), updateLiveLocation);
router.get("/:id/tracking", authorize("owner"), getLiveTracking);

export default router;
