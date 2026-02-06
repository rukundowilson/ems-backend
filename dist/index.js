import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectMongo } from "./src/data/mongoConfig.js";
import availabilityRoutes from "./src/routes/availability.js";
const app = express();
const PORT = 6000;
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use("/api/availability", availabilityRoutes);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
async function startServer() {
    try {
        await connectMongo();
        console.log("✅ Mongo connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Startup failed:", err);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map