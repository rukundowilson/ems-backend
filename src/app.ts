import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import treatmentRoutes from './routes/treatment.routes';
import { setupSwagger } from './config/swagger';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger
setupSwagger(app);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'EMS Backend API',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/treatment-services', treatmentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;
