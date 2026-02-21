import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load env variables
dotenv.config();

// Connect to database
connectDB();

// Parse CLIENT_URL — supports comma-separated list e.g. "http://localhost:3000,http://192.168.1.8:3000"
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((u) => u.trim())
  : ["http://localhost:3000"];

const app = express();
const httpServer = createServer(app);

// ── Socket.io setup ──────────────────────────────────────────────────────────
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track which socket belongs to which doctor/owner
const doctorSockets = new Map(); // doctorUserId → socketId
const ownerSockets = new Map(); // ownerUserId  → socketId

io.on("connection", (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // ── Doctor registers (called when doctor opens their dashboard) ──────────
  socket.on("doctor-register", (doctorUserId) => {
    doctorSockets.set(doctorUserId, socket.id);
    socket.doctorUserId = doctorUserId;
    console.log(`[Socket] Doctor ${doctorUserId} registered → ${socket.id}`);
  });

  // ── Owner joins an appointment room to receive live updates ──────────────
  socket.on("join-tracking", (appointmentId) => {
    socket.join(`appointment:${appointmentId}`);
    socket.trackingAppointmentId = appointmentId;
    console.log(`[Socket] Owner joined room appointment:${appointmentId}`);
  });

  socket.on("leave-tracking", (appointmentId) => {
    socket.leave(`appointment:${appointmentId}`);
    console.log(`[Socket] Owner left room appointment:${appointmentId}`);
  });

  // ── Doctor pushes GPS location ────────────────────────────────────────────
  // Payload: { appointmentId, latitude, longitude }
  socket.on("location-update", (data) => {
    const { appointmentId, latitude, longitude } = data;
    if (!appointmentId || latitude == null || longitude == null) return;

    // Broadcast to all owners watching this appointment
    io.to(`appointment:${appointmentId}`).emit("tracking-data", {
      appointmentId,
      latitude,
      longitude,
      updatedAt: new Date().toISOString(),
    });
  });

  // ── Status broadcast (doctor changes appointment status) ─────────────────
  socket.on("status-update", ({ appointmentId, status }) => {
    if (!appointmentId || !status) return;
    io.to(`appointment:${appointmentId}`).emit("appointment-status", {
      appointmentId,
      status,
      updatedAt: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    if (socket.doctorUserId) {
      doctorSockets.delete(socket.doctorUserId);
    }
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// ── HTTP middleware ──────────────────────────────────────────────────────────
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
