import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'owner' });
    const totalDoctors = await Doctor.countDocuments({ isVerified: true });
    const totalAppointments = await Appointment.countDocuments();
    const pendingDoctors = await Doctor.countDocuments({ verificationStatus: 'pending' });

    // Calculate revenue (example - you'd want to calculate from payments)
    const completedAppointments = await Appointment.find({ status: 'completed' });
    const revenue = completedAppointments.reduce((sum, apt) => sum + (apt.payment?.amount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        pendingDoctors,
        revenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;

    let query = {};
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending doctor verifications
// @route   GET /api/admin/doctors/pending
// @access  Private (Admin)
export const getPendingDoctors = async (req, res, next) => {
  try {
    const pendingDoctors = await Doctor.find({ verificationStatus: 'pending' })
      .populate('user', 'name email phone createdAt')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pendingDoctors.length,
      data: pendingDoctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (Admin)
export const approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return next(new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404));
    }

    doctor.verificationStatus = 'approved';
    doctor.isVerified = true;
    await doctor.save();

    // Update user verification status
    await User.findByIdAndUpdate(doctor.user, { isVerified: true });

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject doctor
// @route   PUT /api/admin/doctors/:id/reject
// @access  Private (Admin)
export const rejectDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return next(new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404));
    }

    doctor.verificationStatus = 'rejected';
    doctor.isVerified = false;
    doctor.rejectionReason = req.body.reason;
    await doctor.save();

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (admin view)
// @route   GET /api/admin/appointments
// @access  Private (Admin)
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('owner', 'name email')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email' }
      })
      .populate('pet', 'name type breed')
      .sort('-appointmentDate')
      .limit(100);

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin)
export const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, suspendedAt: Date.now(), suspensionReason: req.body.reason },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
