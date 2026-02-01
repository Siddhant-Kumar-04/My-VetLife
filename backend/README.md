# VetLife Backend API

Professional veterinary consultation platform backend built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 Multi-role system (Owner, Doctor, Admin)
- 🐕 Pet management with medical history
- 📅 Appointment booking and management
- ⭐ Doctor ratings and reviews
- 🏥 Doctor verification system
- 📊 Admin dashboard with analytics

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT & bcrypt
- **Validation:** express-validator

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vetlife
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:3000
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account

### Doctors
- `GET /api/doctors` - Get all verified doctors (with filters)
- `GET /api/doctors/:id` - Get single doctor
- `GET /api/doctors/profile/me` - Get doctor profile (auth)
- `PUT /api/doctors/profile` - Update doctor profile (auth)
- `PUT /api/doctors/availability` - Update availability (auth)
- `GET /api/doctors/stats/me` - Get doctor stats (auth)

### Pets
- `GET /api/pets` - Get user's pets
- `POST /api/pets` - Create new pet
- `GET /api/pets/:id` - Get single pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet
- `POST /api/pets/:id/medical-history` - Add medical history (doctor)
- `POST /api/pets/:id/vaccinations` - Add vaccination record (doctor)

### Appointments
- `GET /api/appointments` - Get appointments (filtered by role)
- `POST /api/appointments` - Create appointment (owner)
- `GET /api/appointments/:id` - Get single appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `PUT /api/appointments/:id/confirm` - Confirm appointment (doctor)
- `PUT /api/appointments/:id/complete` - Complete appointment (doctor)
- `PUT /api/appointments/:id/rate` - Rate appointment (owner)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/doctors/pending` - Get pending verifications
- `PUT /api/admin/doctors/:id/approve` - Approve doctor
- `PUT /api/admin/doctors/:id/reject` - Reject doctor
- `GET /api/admin/appointments` - Get all appointments
- `PUT /api/admin/users/:id/suspend` - Suspend user
- `DELETE /api/admin/users/:id` - Delete user

## Data Models

### User
- name, email, password, phone
- role (owner/doctor/admin)
- isVerified, avatar, address

### Doctor
- Linked to User
- specialty, qualifications, licenseNumber
- experience, consultationFee, bio
- location, availability schedule
- rating, reviewCount, totalConsultations
- verificationStatus

### Pet
- Linked to Owner
- name, type, breed, age, weight
- medicalHistory, vaccinations
- allergies, medications

### Appointment
- Linked to Owner, Doctor, Pet
- appointmentDate, appointmentTime, reason
- status, consultationType, location
- payment, prescription, notes
- rating and review

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- Role-based authorization
- Input validation and sanitization
- MongoDB injection protection

## Error Handling

Centralized error handling with custom ErrorResponse class. All errors return consistent JSON format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

The API follows RESTful principles and uses:
- Clean separation of concerns (routes/controllers/models)
- Async/await for asynchronous operations
- Mongoose middleware for pre/post hooks
- Indexes for optimized queries

## License

ISC
