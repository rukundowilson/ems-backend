#!/usr/bin/env node

// Script to delete time slots (availabilities) that are not created by a doctor
// Deletes availabilities with missing, null, or empty doctorId

import { connectMongo, closeMongo, getDb } from '../src/data/mongoConfig.js';
import type { Availability } from '../src/models/Availability.js';

const deleteOrphanedSlots = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectMongo();
    
    const db = getDb();
    const collection = db.collection<Availability>('availabilities');
    
    console.log('\n🔍 Querying orphaned time slots...');
    
    // Query for availabilities without a valid doctorId
    const orphanedSlots = await collection.find({
      $or: [
        { doctorId: { $exists: false } },
        { doctorId: null },
        { doctorId: '' }
      ]
    }).toArray();
    
    console.log(`\n📋 Found ${orphanedSlots.length} orphaned time slot(s):\n`);
    
    if (orphanedSlots.length > 0) {
      orphanedSlots.forEach((slot, index) => {
        console.log(`  ${index + 1}. ID: ${slot._id}`);
        console.log(`     Date: ${slot.date}`);
        console.log(`     Time: ${slot.start} - ${slot.end}`);
        console.log(`     DoctorId: ${slot.doctorId || '(none)'}`);
        console.log(`     Created: ${slot.createdAt ? new Date(slot.createdAt).toISOString() : '(unknown)'}`);
        console.log();
      });
      
      // Delete the orphaned slots
      const result = await collection.deleteMany({
        $or: [
          { doctorId: { $exists: false } },
          { doctorId: null },
          { doctorId: '' }
        ]
      });
      
      console.log(`✅ Successfully deleted ${result.deletedCount} orphaned time slot(s)!`);
    } else {
      console.log('✅ No orphaned time slots found. Database is clean!');
    }
    
  } catch (err) {
    console.error('❌ Error:', (err as Error).message);
    process.exit(1);
  } finally {
    await closeMongo();
    console.log('\n🔌 MongoDB connection closed.');
  }
};

deleteOrphanedSlots();
