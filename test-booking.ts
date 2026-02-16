import "dotenv/config";
import { connectMongo, getDb } from "./src/data/mongoConfig.js";
import { ObjectId } from "mongodb";

async function createTestBooking() {
  try {
    await connectMongo();
    const db = getDb();
    const collection = db.collection("bookings");

    const testBooking = {
      doctorId: new ObjectId(),
      patientId: new ObjectId(),
      service: "General Checkup",
      date: "2026-02-20",
      time: "10:00 AM",
      patientEmail: "patient@test.com",
      patientName: "Test Patient",
      patientPhone: "+1234567890",
      status: "confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(testBooking);
    console.log("✅ Test booking created with ID:", result.insertedId);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    process.exit(0);
  }
}

createTestBooking();
