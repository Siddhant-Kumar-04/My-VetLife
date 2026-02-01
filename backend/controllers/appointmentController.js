import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Pet from '../models/Pet.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res, next) => {
  try {
    let query = {};

    // Filter based on user role
    if (req.user.role === 'owner') {
      query.owner = req.user.id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor) {
        return next(new ErrorResponse('Doctor profile not found', 404));
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
        $lte: new Date(req.query.endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate({
        path: 'pet',
        select: 'name type breed age weight gender',
        populate: { path: 'owner', select: 'name email phone' }
      })
      .sort('-appointmentDate');

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
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
      .populate('owner', 'name email phone address')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('pet');

    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }

    // Check authorization
    const doctor = await Doctor.findOne({ user: req.user.id });
    const isOwner = appointment.owner._id.toString() === req.user.id;
    const isDoctor = doctor && appointment.doctor._id.toString() === doctor._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isDoctor && !isAdmin) {
      return next(new ErrorResponse('Not authorized to access this appointment', 401));
    }

    res.status(200).json({
      success: true,
      data: appointment
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
      return next(new ErrorResponse('Pet not found or not authorized', 404));
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor) {
      return next(new ErrorResponse('Doctor not found', 404));
    }

    // Set payment amount from doctor's consultation fee
    if (!req.body.payment) {
      req.body.payment = {};
    }
    req.body.payment.amount = doctor.consultationFee;

    const appointment = await Appointment.create(req.body);

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('pet', 'name type breed');

    res.status(201).json({
      success: true,
      data: populatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }

    // Check authorization
    const doctor = await Doctor.findOne({ user: req.user.id });
    const isOwner = appointment.owner.toString() === req.user.id;
    const isDoctor = doctor && appointment.doctor.toString() === doctor._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isDoctor && !isAdmin) {
      return next(new ErrorResponse('Not authorized to update this appointment', 401));
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('owner', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('pet', 'name type breed');

    res.status(200).json({
      success: true,
      data: appointment
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
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }

    // Check authorization
    const doctor = await Doctor.findOne({ user: req.user.id });
    const isOwner = appointment.owner.toString() === req.user.id;
    const isDoctor = doctor && appointment.doctor.toString() === doctor._id.toString();

    if (!isOwner && !isDoctor) {
      return next(new ErrorResponse('Not authorized to cancel this appointment', 401));
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user.role;
    appointment.cancellationReason = req.body.reason;
    appointment.cancelledAt = Date.now();

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment
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
      return next(new ErrorResponse('Doctor profile not found', 404));
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return next(new ErrorResponse('Not authorized to confirm this appointment', 401));
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment
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
      return next(new ErrorResponse('Doctor profile not found', 404));
    }

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return next(new ErrorResponse('Not authorized to complete this appointment', 401));
    }

    appointment.status = 'completed';
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
      data: appointment
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
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }

    if (appointment.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to rate this appointment', 401));
    }

    if (appointment.status !== 'completed') {
      return next(new ErrorResponse('Can only rate completed appointments', 400));
    }

    appointment.rating = {
      value: req.body.rating,
      review: req.body.review,
      createdAt: Date.now()
    };

    await appointment.save();

    // Update doctor rating
    const doctor = await Doctor.findById(appointment.doctor);
    const appointments = await Appointment.find({ 
      doctor: doctor._id, 
      'rating.value': { $exists: true } 
    });
    
    const totalRating = appointments.reduce((sum, apt) => sum + apt.rating.value, 0);
    doctor.rating = totalRating / appointments.length;
    doctor.reviewCount = appointments.length;
    await doctor.save();

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};
