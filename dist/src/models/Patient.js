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
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        role: payload.role || 'patient',
        status: payload.status || 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    if (payload.firebaseUid)
        doc.firebaseUid = payload.firebaseUid;
    if (payload.passwordHash)
        doc.passwordHash = payload.passwordHash;
    if (payload.services && payload.services.length > 0)
        doc.services = payload.services;
    if (payload.specialization)
        doc.specialization = payload.specialization;
    if (payload.title)
        doc.title = payload.title;
    if (payload.availability)
        doc.availability = payload.availability;
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