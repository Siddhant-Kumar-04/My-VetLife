import express from "express";
import {
  getDoctors,
  getDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  updateAvailability,
  getDoctorStats,
  setOnlineStatus,
} from "../controllers/doctorController.js";
import { protect, authorize } from "../middlewares/auth.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// ── Public routes ─────────────────────────────────────────
router.get("/", getDoctors);

// ── Admin-only migration route to update all doctors to 24/7 availability ─
router.post("/admin/migrate-availability", protect, authorize("admin"), async (req, res, next) => {
  try {
    const newAvailability = {
      monday: { start: "00:00", end: "23:59", available: true },
      tuesday: { start: "00:00", end: "23:59", available: true },
      wednesday: { start: "00:00", end: "23:59", available: true },
      thursday: { start: "00:00", end: "23:59", available: true },
      friday: { start: "00:00", end: "23:59", available: true },
      saturday: { start: "00:00", end: "23:59", available: true },
      sunday: { start: "00:00", end: "23:59", available: true },
    };

    const result = await Doctor.updateMany(
      {},
      { availability: newAvailability }
    );

    res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} doctors with 24/7 availability`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// ── Private doctor-only routes (static paths BEFORE /:id) ─
router.get("/profile/me", protect, authorize("doctor"), getDoctorProfile);
router.get("/stats/me", protect, authorize("doctor"), getDoctorStats);
router.put("/profile", protect, authorize("doctor"), updateDoctorProfile);
router.put("/availability", protect, authorize("doctor"), updateAvailability);
router.put("/online-status", protect, authorize("doctor"), setOnlineStatus);

// ── Public single-doctor route (param LAST to avoid conflicts) ─
router.get("/:id", getDoctor);

export default router;
