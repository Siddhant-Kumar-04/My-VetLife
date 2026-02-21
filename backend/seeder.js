import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import Pet from "./models/Pet.js";
import Appointment from "./models/Appointment.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Doctor.deleteMany();
    await Pet.deleteMany();
    await Appointment.deleteMany();

    console.log("Data cleared");

    // Create users
    const owner1 = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      phone: "+1 (555) 123-4567",
      role: "owner",
      isVerified: true,
    });

    const owner2 = await User.create({
      name: "Sarah Smith",
      email: "sarah@example.com",
      password: "password123",
      phone: "+1 (555) 234-5678",
      role: "owner",
      isVerified: true,
    });

    const doctorUser1 = await User.create({
      name: "Dr. Sarah Wilson",
      email: "dr.wilson@example.com",
      password: "password123",
      phone: "+1 (555) 987-6543",
      role: "doctor",
      isVerified: true,
    });

    const doctorUser2 = await User.create({
      name: "Dr. Michael Chen",
      email: "dr.chen@example.com",
      password: "password123",
      phone: "+1 (555) 876-5432",
      role: "doctor",
      isVerified: true,
    });

    const adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      phone: "+1 (555) 000-0000",
      role: "admin",
      isVerified: true,
    });

    console.log("Users created");

    // Create doctors
    const doctor1 = await Doctor.create({
      user: doctorUser1._id,
      specialty: "General Veterinarian",
      qualifications: [
        { degree: "DVM", institution: "Cornell University", year: 2015 },
        { degree: "MS", institution: "UC Davis", year: 2017 },
      ],
      licenseNumber: "VET-NY-12345",
      experience: 8,
      consultationFee: 75,
      bio: "Experienced general veterinarian specializing in preventive care and internal medicine.",
      location: { city: "Manhattan", state: "NY" },
      availability: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "10:00", end: "14:00", available: false },
        sunday: { start: "10:00", end: "14:00", available: false },
      },
      rating: 4.9,
      reviewCount: 124,
      totalConsultations: 245,
      isVerified: true,
      verificationStatus: "approved",
    });

    const doctor2 = await Doctor.create({
      user: doctorUser2._id,
      specialty: "Feline Specialist",
      qualifications: [
        { degree: "DVM", institution: "Tufts University", year: 2012 },
        { degree: "ABVP (Feline)", institution: "ABVP", year: 2014 },
      ],
      licenseNumber: "VET-NY-67890",
      experience: 12,
      consultationFee: 90,
      bio: "Board-certified feline specialist with extensive experience in cat care.",
      location: { city: "Brooklyn", state: "NY" },
      availability: {
        monday: { start: "10:00", end: "18:00", available: true },
        tuesday: { start: "10:00", end: "18:00", available: true },
        wednesday: { start: "10:00", end: "18:00", available: true },
        thursday: { start: "10:00", end: "18:00", available: true },
        friday: { start: "10:00", end: "18:00", available: true },
        saturday: { start: "09:00", end: "13:00", available: false },
        sunday: { start: "09:00", end: "13:00", available: false },
      },
      rating: 4.8,
      reviewCount: 98,
      totalConsultations: 187,
      isVerified: true,
      verificationStatus: "approved",
    });

    console.log("Doctors created");

    // Create pets
    const pet1 = await Pet.create({
      owner: owner1._id,
      name: "Max",
      type: "dog",
      breed: "Golden Retriever",
      age: { years: 3, months: 0 },
      weight: { value: 30, unit: "kg" },
      gender: "male",
      color: "Golden",
      vaccinations: [
        {
          name: "Rabies",
          date: new Date("2025-06-15"),
          nextDue: new Date("2026-06-15"),
          doctor: doctor1._id,
        },
      ],
    });

    const pet2 = await Pet.create({
      owner: owner2._id,
      name: "Luna",
      type: "cat",
      breed: "Persian",
      age: { years: 2, months: 0 },
      weight: { value: 4, unit: "kg" },
      gender: "female",
      color: "White",
      vaccinations: [
        {
          name: "FVRCP",
          date: new Date("2025-05-20"),
          nextDue: new Date("2026-05-20"),
          doctor: doctor2._id,
        },
      ],
    });

    console.log("Pets created");

    // Create appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointment1 = await Appointment.create({
      owner: owner1._id,
      doctor: doctor1._id,
      pet: pet1._id,
      appointmentDate: tomorrow,
      appointmentTime: "10:00 AM",
      reason: "Annual checkup",
      status: "accepted",
      consultationType: "home-visit",
      location: {
        address: "123 Pet Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
      payment: {
        amount: 75,
        status: "pending",
      },
    });

    const appointment2 = await Appointment.create({
      owner: owner2._id,
      doctor: doctor2._id,
      pet: pet2._id,
      appointmentDate: new Date(tomorrow.getTime() + 86400000),
      appointmentTime: "2:30 PM",
      reason: "Vaccination",
      status: "pending",
      consultationType: "home-visit",
      location: {
        address: "456 Animal Ave",
        city: "New York",
        state: "NY",
        zipCode: "10002",
      },
      payment: {
        amount: 90,
        status: "pending",
      },
    });

    console.log("Appointments created");
    console.log("\n=== Seed Data Created Successfully ===\n");
    console.log("Test Accounts:");
    console.log("Owner: john@example.com / password123");
    console.log("Doctor: dr.wilson@example.com / password123");
    console.log("Admin: admin@example.com / password123");
    console.log("\n=====================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

connectDB();
seedData();
