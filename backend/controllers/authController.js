import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";

const defaultAvailability = {
  monday: { start: "09:00", end: "17:00", available: true },
  tuesday: { start: "09:00", end: "17:00", available: true },
  wednesday: { start: "09:00", end: "17:00", available: true },
  thursday: { start: "09:00", end: "17:00", available: true },
  friday: { start: "09:00", end: "17:00", available: true },
  saturday: { start: "10:00", end: "14:00", available: false },
  sunday: { start: "10:00", end: "14:00", available: false },
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "owner",
    });

    // If registering as doctor, create doctor profile
    if (role === "doctor") {
      const {
        specialty,
        qualifications,
        licenseNumber,
        experience,
        consultationFee,
        location,
      } = req.body;

      // Validate required doctor fields
      if (!specialty) {
        return next(new ErrorResponse("Please provide a specialty", 400));
      }
      if (!licenseNumber) {
        return next(new ErrorResponse("Please provide a license number", 400));
      }
      if (!experience && experience !== 0) {
        return next(
          new ErrorResponse("Please provide years of experience", 400),
        );
      }
      if (!consultationFee && consultationFee !== 0) {
        return next(
          new ErrorResponse("Please provide a consultation fee", 400),
        );
      }
      if (!qualifications) {
        return next(
          new ErrorResponse("Please provide your qualifications", 400),
        );
      }
      if (!location || !location.city || !location.state) {
        return next(
          new ErrorResponse(
            "Please provide your location (city and state)",
            400,
          ),
        );
      }

      // Parse qualifications string into array format
      // Expected format: "DVM - Cornell University, 2015"
      const qualificationsArray = qualifications
        ? [
            {
              degree: qualifications.split("-")[0]?.trim() || qualifications,
              institution:
                qualifications.split("-")[1]?.split(",")[0]?.trim() ||
                "Not specified",
              year:
                parseInt(qualifications.split(",")[1]?.trim()) ||
                new Date().getFullYear(),
            },
          ]
        : [];

      await Doctor.create({
        user: user._id,
        specialty,
        qualifications: qualificationsArray,
        licenseNumber,
        experience: experience || 0,
        consultationFee: consultationFee || 0,
        availability: JSON.parse(JSON.stringify(defaultAvailability)),
        location: location || {},
        verificationStatus: "pending",
        isVerified: false,
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400),
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return next(new ErrorResponse("Password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
