import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const defaultDaySchedule = {
  monday: { start: "09:00", end: "17:00", available: true },
  tuesday: { start: "09:00", end: "17:00", available: true },
  wednesday: { start: "09:00", end: "17:00", available: true },
  thursday: { start: "09:00", end: "17:00", available: true },
  friday: { start: "09:00", end: "17:00", available: true },
  saturday: { start: "10:00", end: "14:00", available: false },
  sunday: { start: "10:00", end: "14:00", available: false },
};

const normalizeAvailability = (
  currentAvailability = {},
  incomingAvailability = {},
) => {
  const normalized = {};

  for (const day of Object.keys(defaultDaySchedule)) {
    const current = currentAvailability[day] || {};
    const incoming = incomingAvailability[day] || {};
    let available = defaultDaySchedule[day].available;

    if (typeof current.available === "boolean") {
      available = current.available;
    }

    if (typeof incoming.available === "boolean") {
      available = incoming.available;
    }

    normalized[day] = {
      start:
        incoming.start ||
        incoming.startTime ||
        current.start ||
        defaultDaySchedule[day].start,
      end:
        incoming.end ||
        incoming.endTime ||
        current.end ||
        defaultDaySchedule[day].end,
      available,
    };
  }

  return normalized;
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res, next) => {
  try {
    const { specialty, minRating, sortBy, search } = req.query;

    // Only show doctors approved by admin
    let query = { verificationStatus: "approved", isVerified: true };

    // Filter by specialty
    if (specialty && specialty !== "all") {
      query.specialty = specialty;
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Search by doctor name via the User collection
    if (search) {
      const users = await User.find({
        role: "doctor",
        name: { $regex: search, $options: "i" },
      }).select("_id");
      query.user = { $in: users.map((u) => u._id) };
    }

    // Sorting
    let sort = {};
    if (sortBy === "rating") {
      sort = { rating: -1 };
    } else if (sortBy === "reviews") {
      sort = { reviewCount: -1 };
    } else if (sortBy === "experience") {
      sort = { experience: -1 };
    } else {
      sort = { rating: -1 };
    }

    const doctors = await Doctor.find(query)
      .populate("user", "name email phone avatar")
      .sort(sort);

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email phone avatar address",
    );

    if (!doctor) {
      return next(
        new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor profile (for logged in doctor)
// @route   GET /api/doctors/profile/me
// @access  Private (Doctor)
export const getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate(
      "user",
      "name email phone avatar address",
    );

    if (!doctor) {
      return next(new ErrorResponse("Doctor profile not found", 404));
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor)
export const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("user", "name email phone avatar");

    if (!doctor) {
      return next(new ErrorResponse("Doctor profile not found", 404));
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/availability
// @access  Private (Doctor)
export const updateAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new ErrorResponse("Doctor profile not found", 404));
    }

    doctor.availability = normalizeAvailability(
      doctor.availability || {},
      req.body.availability || {},
    );

    await doctor.save();

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor stats
// @route   GET /api/doctors/stats
// @access  Private (Doctor)
export const getDoctorStats = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new ErrorResponse("Doctor profile not found", 404));
    }

    // You can add more detailed stats calculation here
    const stats = {
      totalConsultations: doctor.totalConsultations,
      rating: doctor.rating,
      reviewCount: doctor.reviewCount,
      isVerified: doctor.isVerified,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set doctor online / offline
// @route   PUT /api/doctors/online-status
// @access  Private (Doctor)
export const setOnlineStatus = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return next(new ErrorResponse("Doctor profile not found", 404));
    }

    const { isOnline } = req.body;
    if (typeof isOnline !== "boolean") {
      return next(
        new ErrorResponse(
          "Please provide isOnline as a boolean (true / false)",
          400,
        ),
      );
    }

    doctor.isActive = isOnline;
    doctor.lastSeen = new Date();
    await doctor.save();

    res.status(200).json({
      success: true,
      data: {
        isOnline: doctor.isActive,
        lastSeen: doctor.lastSeen,
      },
    });
  } catch (error) {
    next(error);
  }
};
