import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';
const COLLECTION_NAME = 'bookings';
export async function getBookingsCollection() {
    const db = getDb();
    return db.collection(COLLECTION_NAME);
}
export async function getAllBookings() {
    const collection = await getBookingsCollection();
    return collection.find({}).sort({ createdAt: -1 }).toArray();
}
export async function getBookingById(id) {
    const collection = await getBookingsCollection();
    return collection.findOne({ _id: new ObjectId(id) });
}
export async function getBookingsByDoctor(doctorId) {
    const collection = await getBookingsCollection();
    return collection.find({ doctorId }).sort({ createdAt: -1 }).toArray();
}
export async function getBookingsByPatient(patientId) {
    const collection = await getBookingsCollection();
    return collection.find({ patientId }).sort({ createdAt: -1 }).toArray();
}
export async function createBooking(booking) {
    const collection = await getBookingsCollection();
    const doc = {
        ...booking,
        status: booking.status || 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = await collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
}
export async function updateBooking(id, updates) {
    const collection = await getBookingsCollection();
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: 'after' });
    return result || null;
}
export async function deleteBooking(id) {
    const collection = await getBookingsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}
//# sourceMappingURL=Booking.js.map