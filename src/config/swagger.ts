import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EMS Backend API',
      version: '1.0.0',
      description: 'Employee Management System - Doctor Appointment Booking API',
    },
    servers: [
      {
        url: 'https://ems-backend-2-jl41.onrender.com',
        description: 'production-server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Patient: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['patient', 'doctor', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Doctors', description: 'Doctor management endpoints' },
      { name: 'Patients', description: 'Patient management endpoints' },
      { name: 'Services', description: 'Service management endpoints' },
      { name: 'Bookings', description: 'Booking management endpoints' },
      { name: 'Availability', description: 'Doctor availability management' },
      { name: 'Admin - Patients', description: 'Admin patient management' },
      { name: 'Admin - Doctors', description: 'Admin doctor management' },
      { name: 'Admin - Services', description: 'Admin service management' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
