import Pet from '../models/Pet.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @desc    Get all pets for logged in user
// @route   GET /api/pets
// @access  Private
export const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ owner: req.user.id })
      .populate('medicalHistory.doctor', 'specialty')
      .populate('vaccinations.doctor', 'specialty')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private
export const getPet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('medicalHistory.doctor', 'specialty')
      .populate('vaccinations.doctor', 'specialty');

    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is pet owner
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this pet', 401));
    }

    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
export const createPet = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    const pet = await Pet.create(req.body);

    res.status(201).json({
      success: true,
      data: pet
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
export const updatePet = async (req, res, next) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is pet owner
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this pet', 401));
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
export const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is pet owner
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this pet', 401));
    }

    await pet.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add medical history entry
// @route   POST /api/pets/:id/medical-history
// @access  Private (Doctor)
export const addMedicalHistory = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404));
    }

    pet.medicalHistory.push(req.body);
    await pet.save();

    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add vaccination record
// @route   POST /api/pets/:id/vaccinations
// @access  Private (Doctor)
export const addVaccination = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404));
    }

    pet.vaccinations.push(req.body);
    await pet.save();

    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    next(error);
  }
};
