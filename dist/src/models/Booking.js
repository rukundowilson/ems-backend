import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';
const COLLECTION_NAME = 'bookings';
export async function getBookingsCollection() {
    const db = getDb();
    return db.collection(COLLECTION_NAME);
}
export async function createBooking(payload) {
    const collection = await getBookingsCollection();
    const doc = {
        service: payload.service,
        date: payload.date,
        time: payload.time,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Only add optional fields if they exist
    if (payload.doctorId !== undefined)
        doc.doctorId = payload.doctorId;
    if (payload.patientId !== undefined)
        doc.patientId = payload.patientId;
    if (payload.patientEmail !== undefined)
        doc.patientEmail = payload.patientEmail;
    if (payload.patientName !== undefined)
        doc.patientName = payload.patientName;
    if (payload.patientPhone !== undefined)
        doc.patientPhone = payload.patientPhone;
    if (payload.paymentMethod !== undefined)
        doc.paymentMethod = payload.paymentMethod;
    if (payload.amount !== undefined)
        doc.amount = payload.amount;
    const result = await collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
}
export async function getBookingById(id) {
    const collection = await getBookingsCollection();
    try {
        const objectId = new ObjectId(id);
        return collection.findOne({ _id: objectId });
    }
    catch (e) {
        // If id is not a valid ObjectId, return null
        return null;
    }
}
export async function getBookingsByPatientId(patientId) {
    const collection = await getBookingsCollection();
    return collection.find({ patientId }).toArray();
}
export async function getBookingsByDoctorId(doctorId) {
    const collection = await getBookingsCollection();
    return collection.find({ doctorId }).toArray();
}
export async function getAllBookings() {
    const collection = await getBookingsCollection();
    return collection.find({}).toArray();
}
export async function updateBooking(id, payload) {
    const collection = await getBookingsCollection();
    try {
        const objectId = new ObjectId(id);
        const result = await collection.findOneAndUpdate({ _id: objectId }, { $set: { ...payload, updatedAt: new Date() } }, { returnDocument: 'after' });
        // MongoDB driver v7 returns result with .value property
        let updatedDoc = result?.value;
        // Fallback: if findOneAndUpdate didn't return the document, fetch it explicitly
        if (!updatedDoc) {
            console.warn(`findOneAndUpdate returned no document for ID: ${id}, fetching separately`);
            updatedDoc = await collection.findOne({ _id: objectId });
        }
        return updatedDoc || null;
    }
    catch (e) {
        console.error('Error updating booking:', { id, error: String(e) });
        return null;
    }
}
export async function deleteBooking(id) {
    const collection = await getBookingsCollection();
    try {
        const objectId = new ObjectId(id);
        const result = await collection.deleteOne({ _id: objectId });
        return result.deletedCount > 0;
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=Booking.js.map