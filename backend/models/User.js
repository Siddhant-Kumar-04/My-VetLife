import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["owner", "doctor", "admin"],
      default: "owner",
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    isOnline:{
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
  },
  {
    timestamps: true,
  },
);
//   find nearby doctor  based on current location
userSchema.index({ currentLocation: "2dsphere" }); 

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
