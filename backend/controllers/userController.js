import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    // Whitelist: only allow safe, non-privileged fields to be updated.
    // role, password, isVerified, and email changes are intentionally excluded.
    const ALLOWED_FIELDS = ["name", "phone", "avatar", "address"];
    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return next(new ErrorResponse("No valid fields provided to update", 400));
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
