// src/index.ts
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("EMS Backend is running!");
});

// Example API route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Start servernpm 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
