#!/usr/bin/env node

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';

async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db('ems');
    const availabilitiesCollection = db.collection('availabilities');
    const patientsCollection = db.collection('patients');

    // Get all doctors (patients with role 'doctor')
    const doctors = await patientsCollection.find({ role: 'doctor' }).limit(3).toArray();

    if (doctors.length === 0) {
      console.log('No doctors found');
      return;
    }

    console.log(`\nFound ${doctors.length} doctors. Creating availability slots...\n`);

    // Generate availability for next 7 days
    const today = new Date();
    const slots: any[] = [];

    for (let doctorIdx = 0; doctorIdx < doctors.length; doctorIdx++) {
      const doctor = doctors[doctorIdx];
      const doctorId = doctor._id.toString();
      const doctorName = doctor.name || 'Doctor';

      for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Create 3 slots per day: 09:00-11:00, 11:00-14:00, 14:00-17:00
        const daySlots = [
          { start: '09:00', end: '11:00' },
          { start: '11:00', end: '14:00' },
          { start: '14:00', end: '17:00' },
        ];

        for (const slot of daySlots) {
          slots.push({
            doctorId,
            date: dateStr,
            start: slot.start,
            end: slot.end,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      console.log(`✓ Created slots for ${doctorName} (${slots.filter(s => s.doctorId === doctorId).length} slots)`);
    }

    // Clear existing availability and insert new
    await availabilitiesCollection.deleteMany({});
    const result = await availabilitiesCollection.insertMany(slots);

    console.log(`\n✓ Successfully inserted ${result.insertedCount} availability slots`);
    console.log('\nSample slots created for:');
    console.log('- Dates: Next 7 weekdays');
    console.log('- Times: 09:00-11:00, 11:00-14:00, 14:00-17:00');
    console.log('- Doctors: First 3 doctors in database');
  } catch (err) {
    console.error('Error:', (err as Error).message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✓ Done');
  }
}

main();
