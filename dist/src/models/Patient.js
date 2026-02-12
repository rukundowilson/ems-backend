import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';
const COLLECTION_NAME = 'patients';
export async function getPatientsCollection() {
    const db = getDb();
    return db.collection(COLLECTION_NAME);
}
export async function createPatient(payload) {
    const collection = await getPatientsCollection();
    const doc = {
        firebaseUid: payload.firebaseUid || undefined,
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        passwordHash: payload.passwordHash || undefined,
        role: payload.role || 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = await collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
}
export async function getPatientByFirebaseUid(uid) {
    const collection = await getPatientsCollection();
    return collection.findOne({ firebaseUid: uid });
}
export async function getPatientByEmail(email) {
    const collection = await getPatientsCollection();
    return collection.findOne({ email });
}
export async function getPatientById(id) {
    const collection = await getPatientsCollection();
    return collection.findOne({ _id: new ObjectId(id) });
}
export async function getAllPatients() {
    const collection = await getPatientsCollection();
    return collection.find({}).toArray();
}
export async function getPatientsByRole(role) {
    const collection = await getPatientsCollection();
    return collection.find({ role }).toArray();
}
export async function updatePatient(id, updates) {
    const collection = await getPatientsCollection();
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: 'after' });
    return result || null;
}
export async function deletePatient(id) {
    const collection = await getPatientsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}
//# sourceMappingURL=Patient.js.map