import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';
const COLLECTION_NAME = 'availabilities';
export async function getAvailabilityCollection() {
    const db = getDb();
    return db.collection(COLLECTION_NAME);
}
export async function getDoctorAvailability(doctorId) {
    const collection = await getAvailabilityCollection();
    return collection.find({ doctorId }).sort({ date: 1, start: 1 }).toArray();
}
export async function getAvailabilityByDate(doctorId, date) {
    const collection = await getAvailabilityCollection();
    return collection.find({ doctorId, date }).sort({ start: 1 }).toArray();
}
export async function createAvailability(doctorId, availability) {
    const collection = await getAvailabilityCollection();
    const doc = {
        doctorId,
        ...availability,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = await collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
}
export async function createBulkAvailability(doctorId, availabilities) {
    const collection = await getAvailabilityCollection();
    const docs = availabilities.map((av) => ({
        doctorId,
        ...av,
        createdAt: new Date(),
        updatedAt: new Date(),
    }));
    const result = await collection.insertMany(docs);
    return docs.map((doc, i) => ({ ...doc, _id: result.insertedIds[i] }));
}
export async function updateAvailability(id, updates) {
    const collection = await getAvailabilityCollection();
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: 'after' });
    return result || null;
}
export async function deleteAvailability(id) {
    const collection = await getAvailabilityCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}
export async function deleteAvailabilityByDate(doctorId, date) {
    const collection = await getAvailabilityCollection();
    const result = await collection.deleteMany({ doctorId, date });
    return result.deletedCount;
}
//# sourceMappingURL=Availability.js.map