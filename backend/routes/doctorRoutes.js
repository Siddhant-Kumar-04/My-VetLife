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

const router = express.Router();

// ── Public routes ─────────────────────────────────────────
router.get("/", getDoctors);

// ── Private doctor-only routes (static paths BEFORE /:id) ─
router.get("/profile/me", protect, authorize("doctor"), getDoctorProfile);
router.get("/stats/me", protect, authorize("doctor"), getDoctorStats);
router.put("/profile", protect, authorize("doctor"), updateDoctorProfile);
router.put("/availability", protect, authorize("doctor"), updateAvailability);
router.put("/online-status", protect, authorize("doctor"), setOnlineStatus);

// ── Public single-doctor route (param LAST to avoid conflicts) ─
router.get("/:id", getDoctor);

export default router;
