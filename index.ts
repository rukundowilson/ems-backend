import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.js";
import { connectMongo } from "./src/data/mongoConfig.js";
import availabilityRoutes from "./src/routes/availability.js";
import authRoutes from "./src/routes/auth.js";
import serviceRoutes from "./src/routes/services.js";
import bookingsRoutes from "./src/routes/bookings.js";
import adminRoutes from "./src/routes/admin.js";
import doctorRoutes from "./src/routes/doctors.js";

const app = express();
const PORT = 4000;


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Routes
app.use("/api/availability", availabilityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "EMS Backend API", docs: "https://ems-backend-2-jl41.onrender.com" });
});

async function startServer() {
  try {
    await connectMongo();
    console.log("✅ Mongo connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
}

startServer();

