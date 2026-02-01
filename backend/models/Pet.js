import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide pet name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide pet type'],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  breed: {
    type: String,
    required: [true, 'Please provide pet breed'],
    trim: true
  },
  age: {
    years: { type: Number, default: 0 },
    months: { type: Number, default: 0 }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  color: String,
  microchipId: String,
  medicalHistory: [{
    condition: String,
    diagnosis: String,
    treatment: String,
    date: Date,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    }
  }],
  vaccinations: [{
    name: String,
    date: Date,
    nextDue: Date,
    batch: String,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    }
  }],
  allergies: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date
  }],
  avatar: String,
  notes: String
}, {
  timestamps: true
});

// Index for owner lookup
petSchema.index({ owner: 1 });

export default mongoose.model('Pet', petSchema);
