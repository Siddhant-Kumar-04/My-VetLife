import Razorpay from "razorpay";
import crypto from "crypto";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// Initialize Razorpay dynamically (inside functions, not at module load time)
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create a Razorpay order for appointment payment
// @route   POST /api/payments/create-order
// @access  Private (Owner)
export const createOrder = async (req, res, next) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.id;

    // Get Razorpay instance here (after env vars are loaded)
    const razorpay = getRazorpayInstance();

    // Validate appointment exists and belongs to the user
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor")
      .populate("owner");

    if (!appointment) {
      return next(new ErrorResponse("Appointment not found", 404));
    }

    if (appointment.owner._id.toString() !== userId) {
      return next(
        new ErrorResponse("Not authorized to pay for this appointment", 403),
      );
    }

    if (appointment.payment.status === "paid") {
      return next(
        new ErrorResponse("This appointment has already been paid", 400),
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(appointment.payment.amount * 100), // Convert to paise
      currency: "INR",
      receipt: `appointment_${appointmentId}`,
      notes: {
        appointmentId: appointmentId,
        userId: userId,
        doctorId: appointment.doctor._id,
      },
    });

    // Save order ID to appointment
    appointment.payment.razorpay.orderId = order.id;
    await appointment.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: appointment.payment.amount,
      currency: "INR",
      appointmentId: appointmentId,
      userEmail: appointment.owner.email,
      userName: appointment.owner.name,
      userId: userId,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return next(
      new ErrorResponse(
        "Failed to create payment order: " + error.message,
        500,
      ),
    );
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private (Owner)
export const verifyPayment = async (req, res, next) => {
  try {
    const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const userId = req.user.id;

    // Verify the signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new ErrorResponse("Payment verification failed", 400));
    }

    // Update appointment payment status
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return next(new ErrorResponse("Appointment not found", 404));
    }

    if (appointment.owner.toString() !== userId) {
      return next(
        new ErrorResponse(
          "Not authorized to verify payment for this appointment",
          403,
        ),
      );
    }

    // Update payment details
    appointment.payment.status = "paid";
    appointment.payment.method = "razorpay";
    appointment.payment.transactionId = razorpay_payment_id;
    appointment.payment.paidAt = new Date();
    appointment.payment.razorpay.paymentId = razorpay_payment_id;
    appointment.payment.razorpay.signature = razorpay_signature;
    
    // Update appointment status from pending_payment to pending (waiting for doctor acceptance)
    appointment.status = "pending";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and appointment confirmed",
      appointment,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return next(
      new ErrorResponse(
        "Payment verification failed: " + error.message,
        500,
      ),
    );
  }
};

// @desc    Process refund for a payment
// @route   POST /api/payments/refund
// @access  Private (Owner or Doctor or Admin)
export const processRefund = async (req, res, next) => {
  try {
    const { appointmentId, reason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const appointment = await Appointment.findById(appointmentId)
      .populate("owner")
      .populate("doctor");

    if (!appointment) {
      return next(new ErrorResponse("Appointment not found", 404));
    }

    // Check authorization
    const isOwner = appointment.owner._id.toString() === userId;
    const isDoctor = appointment.doctor._id.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isDoctor && !isAdmin) {
      return next(new ErrorResponse("Not authorized to refund this appointment", 403));
    }

    // Check if appointment was already paid
    if (appointment.payment.status !== "paid") {
      return next(
        new ErrorResponse(
          "Can only refund paid appointments",
          400,
        ),
      );
    }

    // Check if already refunded
    if (appointment.payment.status === "refunded") {
      return next(
        new ErrorResponse("This appointment has already been refunded", 400),
      );
    }

    try {
      // Get Razorpay instance here (after env vars are loaded)
      const razorpay = getRazorpayInstance();
      
      // Process refund with Razorpay
      const refund = await razorpay.payments.refund(
        appointment.payment.razorpay.paymentId,
        {
          amount: Math.round(appointment.payment.amount * 100), // Full refund
          notes: {
            appointmentId: appointmentId,
            reason: reason || "Appointment cancelled",
          },
        },
      );

      // Update appointment
      appointment.payment.status = "refunded";
      appointment.payment.razorpay.refundId = refund.id;
      appointment.status = "cancelled";
      appointment.cancelledBy = isOwner ? "owner" : isDoctor ? "doctor" : "admin";
      appointment.cancellationReason = reason || "Payment refunded";
      appointment.cancelledAt = new Date();

      await appointment.save();

      res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        refundId: refund.id,
        appointment,
      });
    } catch (refundError) {
      console.error("Razorpay refund error:", refundError);
      return next(
        new ErrorResponse(
          "Failed to process refund: " + refundError.message,
          500,
        ),
      );
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    return next(
      new ErrorResponse("Refund processing failed: " + error.message, 500),
    );
  }
};

// @desc    Webhook to handle Razorpay payment events
// @route   POST /api/payments/webhook
// @access  Public (needs signature verification)
export const handleWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const generatedSignature = shasum.digest("hex");

    if (generatedSignature !== req.headers["x-razorpay-signature"]) {
      console.error("Webhook signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle payment.authorized event
    if (event === "payment.authorized") {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.order_id;

      // Find appointment by order ID
      const appointment = await Appointment.findOne({
        "payment.razorpay.orderId": orderId,
      });

      if (!appointment) {
        console.warn(`Appointment not found for order: ${orderId}`);
        return res.json({ success: true });
      }

      // Update payment status
      appointment.payment.status = "paid";
      appointment.payment.razorpay.paymentId = paymentId;
      appointment.payment.paidAt = new Date();
      await appointment.save();

      console.log(`Payment authorized for appointment: ${appointment._id}`);
    }

    // Handle payment.failed event
    if (event === "payment.failed") {
      const orderId = payload.payment.entity.order_id;

      const appointment = await Appointment.findOne({
        "payment.razorpay.orderId": orderId,
      });

      if (!appointment) {
        console.warn(`Appointment not found for order: ${orderId}`);
        return res.json({ success: true });
      }

      appointment.payment.status = "pending";
      await appointment.save();

      console.log(`Payment failed for appointment: ${appointment._id}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
