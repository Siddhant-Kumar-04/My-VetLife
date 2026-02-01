import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please provide appointment time']
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for consultation'],
    trim: true
  },
  symptoms: [String],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  consultationType: {
    type: String,
    enum: ['home-visit', 'video-call', 'in-clinic'],
    default: 'home-visit'
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    method: String,
    transactionId: String,
    paidAt: Date
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    tests: [String],
    followUpDate: Date
  },
  notes: {
    ownerNotes: String,
    doctorNotes: String,
    diagnosis: String
  },
  rating: {
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: Date
  },
  cancelledBy: {
    type: String,
    enum: ['owner', 'doctor', 'admin']
  },
  cancellationReason: String,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes for efficient queries
appointmentSchema.index({ owner: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

// Prevent double booking
appointmentSchema.index({ 
  doctor: 1, 
  appointmentDate: 1, 
  appointmentTime: 1 
}, { 
  unique: true,
  partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } }
});

export default mongoose.model('Appointment', appointmentSchema);
