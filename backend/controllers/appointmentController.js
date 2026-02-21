import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Pet from "../models/Pet.js";
import ErrorResponse from "../utils/ErrorResponse.js";
// ── Status state machine ─────────────────────────────────
// pending → accepted → on-the-way → arrived → in-progress → completed
// Any non-terminal state can also → cancelled
const STATUS_TRANSITIONS = {
  pending: ["accepted", "cancelled"],
  accepted: ["on-the-way", "cancelled"],
  "on-the-way": ["arrived", "cancelled"],
  arrived: ["in-progress", "cancelled"],
  "in-progress": ["completed", "cancelled"],
  completed: [], // terminal
  cancelled: [], // terminal
};
// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res, next) => {
  try {
    let query = {};

    // Filter based on user role
    if (req.user.role === "owner") {
      query.owner = req.user.id;
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor) {
        return next(new ErrorResponse("Doctor profile not found", 404));
      }
      query.doctor = doctor._id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.appointmentDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const appointments = await Appointment.find(query)
      .populate("owner", "name email phone")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email phone" },
      })
      .populate({
        path: "pet",
        select: "name type breed age weight gender",
        populate: { path: "owner", select: "name email phone" },
      })
      .sort("-appointmentDate");

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("owner", "name email phone address")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email phone" },
      })
      .populate("pet");

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    // Check authorization
    const doctor = await Doctor.findOne({ user: req.user.id });
    const isOwner = appointment.owner._id.toString() === req.user.id;
    const isDoctor =
      doctor && appointment.doctor._id.toString() === doctor._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isDoctor && !isAdmin) {
      return next(
        new ErrorResponse("Not authorized to access this appointment", 401),
      );
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Owner)
export const createAppointment = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    // Verify pet belongs to user
    const pet = await Pet.findById(req.body.pet);
    if (!pet || pet.owner.toString() !== req.user.id) {
      return next(new ErrorResponse("Pet not found or not authorized", 404));
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor) {
      return next(new ErrorResponse("Doctor not found", 404));
    }

    // Set payment amount from doctor's consultation fee
    if (!req.body.payment) {
      req.body.payment = {};
    }
    req.body.payment.amount = doctor.consultationFee;

    const appointment = await Appointment.create(req.body);

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("owner", "name email phone")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email phone" },
      })
      .populate("pet", "name type breed");

    res.status(201).json({
      success: true,
      data: populatedAppointment,
      ...(doctor.isActive === false && {
        warning:
          "Doctor is currently offline. Your appointment has been submitted; the doctor will be notified when they come online.",
      }),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment (notes, prescription, location — NOT status)
// @route   PUT /api/appointments/:id
// @access  Private (Doctor & Admin only)
// @route   PUT /api/appointments/:id
// @access  Private (Doctor & Admin only — owners must use /cancel)
export const updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    // Only the assigned doctor or an admin may update appointment details
    const doctor = await Doctor.findOne({ user: req.user.id });
    const isDoctor =
      doctor && appointment.doctor.toString() === doctor._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isDoctor && !isAdmin) {
      return next(
        new ErrorResponse(
          "Only the assigned doctor or an admin can update an appointment",
          403,
        ),
      );
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("owner", "name email phone")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email phone" },
      })
      .populate("pet", "name type breed");

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    // Check authorization
    const doctor = await Doctor.findOne({ user: req.user.id });
    const isOwner = appointment.owner.toString() === req.user.id;
    const isDoctor =
      doctor && appointment.doctor.toString() === doctor._id.toString();

    if (!isOwner && !isDoctor) {
      return next(
        new ErrorResponse("Not authorized to cancel this appointment", 401),
      );
    }

    appointment.status = "cancelled";
    appointment.cancelledBy = req.user.role;
    appointment.cancellationReason = req.body.reason;
    appointment.cancelledAt = Date.now();

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm appointment (Doctor)
// @route   PUT /api/appointments/:id/confirm
// @access  Private (Doctor)
export const confirmAppointment = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new ErrorResponse("Doctor profile not found", 404));
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to confirm this appointment", 401),
      );
    }

    if (appointment.status !== "pending") {
      return next(
        new ErrorResponse(
          `Cannot confirm: appointment is already '${appointment.status}'. Only 'pending' appointments can be confirmed.`,
          400,
        ),
      );
    }

    appointment.status = "accepted";
    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete appointment and add notes (Doctor)
// @route   PUT /api/appointments/:id/complete
// @access  Private (Doctor)
export const completeAppointment = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new ErrorResponse("Doctor profile not found", 404));
    }

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to complete this appointment", 401),
      );
    }

    if (appointment.status !== "in-progress") {
      return next(
        new ErrorResponse(
          `Cannot complete: appointment is '${appointment.status}'. Must be 'in-progress' to complete.`,
          400,
        ),
      );
    }

    appointment.status = "completed";
    appointment.tracking.completedAt = new Date();
    if (req.body.notes) {
      appointment.notes.doctorNotes = req.body.notes.doctorNotes;
      appointment.notes.diagnosis = req.body.notes.diagnosis;
    }
    if (req.body.prescription) {
      appointment.prescription = req.body.prescription;
    }

    await appointment.save();

    // Update doctor stats
    doctor.totalConsultations += 1;
    await doctor.save();

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add rating to appointment (Owner)
// @route   PUT /api/appointments/:id/rate
// @access  Private (Owner)
export const rateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    if (appointment.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to rate this appointment", 401),
      );
    }

    if (appointment.status !== "completed") {
      return next(
        new ErrorResponse("Can only rate completed appointments", 400),
      );
    }

    appointment.rating = {
      value: req.body.rating,
      review: req.body.review,
      createdAt: Date.now(),
    };

    await appointment.save();

    // Update doctor rating
    const doctor = await Doctor.findById(appointment.doctor);
    const appointments = await Appointment.find({
      doctor: doctor._id,
      "rating.value": { $exists: true },
    });

    const totalRating = appointments.reduce(
      (sum, apt) => sum + apt.rating.value,
      0,
    );
    doctor.rating = totalRating / appointments.length;
    doctor.reviewCount = appointments.length;
    await doctor.save();

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status with strict flow validation
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor & Admin)
export const updateStatus = async (req, res, next) => {
  try {
    const { status, reason, notes, prescription } = req.body;

    if (!status) {
      return next(new ErrorResponse("Please provide a status", 400));
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    // Only the assigned doctor or admin may drive status changes
    const doctor = await Doctor.findOne({ user: req.user.id });
    const isDoctor =
      doctor && appointment.doctor.toString() === doctor._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isDoctor && !isAdmin) {
      return next(
        new ErrorResponse(
          "Only the assigned doctor or admin can update appointment status",
          403,
        ),
      );
    }

    // ── Flow validation ──────────────────────────────────────
    const allowedNext = STATUS_TRANSITIONS[appointment.status];
    if (!allowedNext) {
      return next(
        new ErrorResponse(
          `Unknown current status: '${appointment.status}'`,
          400,
        ),
      );
    }
    if (!allowedNext.includes(status)) {
      return next(
        new ErrorResponse(
          `Invalid transition: '${appointment.status}' → '${status}'. Allowed: [${allowedNext.join(", ") || "none — terminal state"}]`,
          400,
        ),
      );
    }

    // ── Tracking timestamps ──────────────────────────────────
    const now = new Date();
    if (status === "on-the-way") appointment.tracking.startedAt = now;
    if (status === "arrived") appointment.tracking.arrivedAt = now;
    if (status === "completed") appointment.tracking.completedAt = now;

    // ── On complete: save notes / prescription + update stats ─
    if (status === "completed") {
      if (notes) {
        appointment.notes.doctorNotes =
          notes.doctorNotes || appointment.notes.doctorNotes;
        appointment.notes.diagnosis =
          notes.diagnosis || appointment.notes.diagnosis;
      }
      if (prescription) appointment.prescription = prescription;
      if (doctor) {
        doctor.totalConsultations += 1;
        await doctor.save();
      }
    }

    // ── On cancel: record who / why ──────────────────────────
    if (status === "cancelled") {
      appointment.cancelledBy = req.user.role;
      appointment.cancellationReason = reason || "No reason provided";
      appointment.cancelledAt = now;
    }

    appointment.status = status;
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate("owner", "name email phone")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email phone" },
      })
      .populate("pet", "name type breed");

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Doctor pushes live GPS coordinates for a running appointment
// @route   PUT /api/appointments/:id/location
// @access  Private (Doctor)
export const updateLiveLocation = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body;
    if (longitude === undefined || latitude === undefined) {
      return next(
        new ErrorResponse("Please provide both longitude and latitude", 400),
      );
    }

    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return next(new ErrorResponse("Doctor profile not found", 404));
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    // Only the assigned doctor can push location
    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return next(
        new ErrorResponse(
          "Not authorized to update location for this appointment",
          403,
        ),
      );
    }

    // Location updates only make sense while the doctor is en-route or on-site
    const ACTIVE_STATUSES = ["on-the-way", "arrived", "in-progress"];
    if (!ACTIVE_STATUSES.includes(appointment.status)) {
      return next(
        new ErrorResponse(
          `Live location can only be updated when status is one of: ${ACTIVE_STATUSES.join(", ")}. Current: '${appointment.status}'`,
          400,
        ),
      );
    }

    // Update appointment tracking location (GeoJSON: [lng, lat])
    appointment.tracking.livelocation = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
    await appointment.save();

    res.status(200).json({
      success: true,
      data: {
        appointmentId: appointment._id,
        status: appointment.status,
        location: appointment.tracking.livelocation,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Owner fetches live tracking info for their appointment
// @route   GET /api/appointments/:id/tracking
// @access  Private (Owner of the appointment)
export const getLiveTracking = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .select("owner status tracking appointmentDate appointmentTime doctor")
      .populate({
        path: "doctor",
        select: "location",
        populate: { path: "user", select: "name phone isOnline" },
      });

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not found with id of ${req.params.id}`,
          404,
        ),
      );
    }

    // Only the pet owner of this appointment may poll tracking
    if (appointment.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to track this appointment", 403),
      );
    }

    const trackingStatuses = ["on-the-way", "arrived", "in-progress"];
    const isLive = trackingStatuses.includes(appointment.status);

    res.status(200).json({
      success: true,
      data: {
        appointmentId: appointment._id,
        status: appointment.status,
        isLive,
        doctor: appointment.doctor,
        tracking: {
          startedAt: appointment.tracking.startedAt || null,
          arrivedAt: appointment.tracking.arrivedAt || null,
          completedAt: appointment.tracking.completedAt || null,
          liveLocation: isLive ? appointment.tracking.livelocation : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
