import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';
const COLLECTION_NAME = 'patients';
export async function getDoctorsCollection() {
    const db = getDb();
    return db.collection(COLLECTION_NAME);
}
export async function getAllDoctors() {
    const collection = await getDoctorsCollection();
    return collection.find({ role: 'doctor' }).toArray();
}
export async function getDoctorById(id) {
    const collection = await getDoctorsCollection();
    return collection.findOne({ _id: new ObjectId(id), role: 'doctor' });
}
export async function getDoctorByEmail(email) {
    const collection = await getDoctorsCollection();
    return collection.findOne({ email, role: 'doctor' });
}
export async function updateDoctor(id, updates) {
    const collection = await getDoctorsCollection();
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id), role: 'doctor' }, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: 'after' });
    return result || null;
}
export async function deleteDoctor(id) {
    const collection = await getDoctorsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id), role: 'doctor' });
    return result.deletedCount > 0;
}
//# sourceMappingURL=Doctor.js.map