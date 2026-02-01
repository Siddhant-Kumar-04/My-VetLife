import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialty: {
    type: String,
    required: [true, 'Please provide a specialty'],
    enum: [
      'General Veterinarian',
      'Feline Specialist',
      'Canine Specialist',
      'Emergency Care',
      'Dermatology',
      'Orthopedic Surgery',
      'Cardiology',
      'Dental',
      'Other'
    ]
  },
  qualifications: [{
    degree: {
      type: String,
      required: true
    },
    institution: String,
    year: Number
  }],
  licenseNumber: {
    type: String,
    required: [true, 'Please provide a license number'],
    unique: true
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: [0, 'Experience cannot be negative']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please provide consultation fee'],
    min: [0, 'Fee cannot be negative']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  location: {
    city: String,
    state: String
  },
  availability: {
    monday: { start: String, end: String, available: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
    thursday: { start: String, end: String, available: { type: Boolean, default: true } },
    friday: { start: String, end: String, available: { type: Boolean, default: true } },
    saturday: { start: String, end: String, available: { type: Boolean, default: false } },
    sunday: { start: String, end: String, available: { type: Boolean, default: false } }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  totalConsultations: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String
}, {
  timestamps: true
});

// Index for search optimization
doctorSchema.index({ specialty: 1, isVerified: 1 });
doctorSchema.index({ rating: -1 });

export default mongoose.model('Doctor', doctorSchema);
