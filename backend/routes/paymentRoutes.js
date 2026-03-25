import express from "express";
import {
  createOrder,
  verifyPayment,
  processRefund,
  handleWebhook,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Create Razorpay order (protected)
router.post("/create-order", protect, createOrder);

// Verify payment signature (protected)
router.post("/verify", protect, verifyPayment);

// Process refund (protected)
router.post("/refund", protect, processRefund);

// Webhook for Razorpay events (public but signature verified)
router.post("/webhook", handleWebhook);

export default router;
