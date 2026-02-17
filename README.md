# EMS Backend - Event Management System API

A robust healthcare management system backend built with Node.js, Express, TypeScript, and MongoDB.

## Features

### Core Functionality
- **User Authentication** - JWT-based auth with role management (admin, doctor, patient)
- **Doctor Management** - CRUD operations for doctor profiles
- **Patient Management** - Patient registration and profile management
- **Service Management** - Healthcare services catalog
- **Booking System** - Appointment scheduling and tracking
- **Admin Dashboard** - Comprehensive data access for administrators

### Technical Features
- RESTful API architecture
- MongoDB database with TypeScript models
- JWT token authentication
- Password hashing with bcrypt
- CORS enabled for frontend integration
- Swagger API documentation
- Email notifications via Gmail
- Cloudinary integration for file uploads

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT + bcrypt
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer with Gmail
- **File Storage**: Cloudinary

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB
- Gmail account for email notifications

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ems-backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ems
MONGO_DB=ems

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=4000

# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=products
```

4. Run development server
```bash
npm run dev
```

5. API available at [http://localhost:4000](http://localhost:4000)

## Project Structure

```
src/
├── config/
│   └── swagger.ts          # Swagger configuration
├── controllers/
│   ├── adminController.ts  # Admin operations
│   ├── authController.ts   # Authentication
│   ├── doctorController.ts # Doctor management
│   ├── patientController.ts# Patient management
│   ├── serviceController.ts# Service management
│   └── bookingController.ts# Booking operations
├── data/
│   └── mongoConfig.ts      # MongoDB connection
├── middleware/
│   └── auth.ts             # JWT authentication middleware
├── models/
│   ├── Patient.ts          # User model (patients, doctors, admins)
│   ├── Doctor.ts           # Doctor-specific operations
│   ├── Service.ts          # Service model
│   ├── Booking.ts          # Booking model
│   └── Availability.ts     # Doctor availability
└── routes/
    ├── auth.ts             # Auth routes
    ├── admin.ts            # Admin routes
    ├── doctors.ts          # Doctor routes
    ├── patients.ts         # Patient routes
    ├── services.ts         # Service routes
    └── bookings.ts         # Booking routes
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/create-doctor` - Create doctor account

### Admin Routes (Requires admin role)
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/services` - Get all services
- `GET /api/admin/bookings` - Get all bookings
- `PATCH /api/admin/patients/:id` - Update patient
- `DELETE /api/admin/patients/:id` - Delete patient

### Doctor Routes
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PATCH /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Service Routes
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service
- `PATCH /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Booking Routes
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

## Database Models

### Patient/User Model
```typescript
{
  _id: ObjectId
  email: string
  name: string
  phone: string
  passwordHash: string
  role: 'patient' | 'doctor' | 'admin'
  specialization?: string  // For doctors
  title?: string           // For doctors
  availability?: string    // For doctors
  status?: string          // For doctors
  services?: string[]      // For doctors
  createdAt: Date
  updatedAt: Date
}
```

### Service Model
```typescript
{
  _id: ObjectId
  title: string
  slug: string
  description: string
  createdAt: Date
  updatedAt: Date
}
```

### Booking Model
```typescript
{
  _id: ObjectId
  doctorId: string
  patientId: string
  service: string
  date: string
  time: string
  patientEmail: string
  patientName: string
  patientPhone: string
  paymentMethod: string
  amount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}
```

## Authentication & Authorization

### JWT Token
- Tokens expire in 7 days
- Stored in frontend localStorage
- Attached to requests via Authorization header: `Bearer <token>`

### Roles
- **admin** - Full system access
- **doctor** - Access to own profile and appointments
- **patient** - Access to own profile and bookings

### Default Admin Credentials
- **Email**: admin@gmail.com
- **Password**: admin1234
- **Role**: admin

## Key Features Implementation

### Auto-Service Creation
When creating/updating a doctor with a specialization:
1. System checks if service exists by title
2. If not found, automatically creates new service
3. Links service ID to doctor's services array
4. Saves specialization as text for display

### Password Security
- Passwords hashed using bcrypt (10 rounds)
- Never stored or returned in plain text
- Password hash excluded from API responses

### Role-Based Access
- Middleware validates JWT tokens
- Admin routes protected by role check
- Unauthorized access returns 403 Forbidden

## API Documentation

Swagger documentation available at: `http://localhost:4000/api-docs`

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ems
MONGO_DB=ems
JWT_SECRET=your_secret_key
PORT=4000
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=products
```

## Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Success responses:
```json
{
  "success": true,
  "data": { ... }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
