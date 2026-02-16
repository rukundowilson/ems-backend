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
export async function addServiceToDoctor(doctorId, serviceId) {
    const collection = await getDoctorsCollection();
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(doctorId), role: 'doctor' }, { $addToSet: { services: serviceId }, $set: { updatedAt: new Date() } }, { returnDocument: 'after' });
    return result || null;
}
export async function removeServiceFromDoctor(doctorId, serviceId) {
    const collection = await getDoctorsCollection();
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(doctorId), role: 'doctor' }, { $pull: { services: serviceId }, $set: { updatedAt: new Date() } }, { returnDocument: 'after' });
    return result || null;
}
export async function getServicesForDoctor(doctorId) {
    const doctor = await getDoctorById(doctorId);
    return doctor?.services || [];
}
export async function incrementDoctorCompletedAppointments(doctorId, rating) {
    const collection = await getDoctorsCollection();
    const updateData = {
        $inc: { completedAppointments: 1 },
        $set: { updatedAt: new Date() },
    };
    // Update avgRating if rating is provided
    if (rating) {
        const doctor = await getDoctorById(doctorId);
        const currentCompleted = doctor?.completedAppointments || 0;
        const currentAvgRating = doctor?.avgRating || 0;
        // Calculate new average: (old_avg * old_count + new_rating) / (old_count + 1)
        const newAvgRating = (currentAvgRating * currentCompleted + rating) / (currentCompleted + 1);
        updateData.$set.avgRating = Math.round(newAvgRating * 10) / 10;
    }
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(doctorId), role: 'doctor' }, updateData, { returnDocument: 'after' });
    return result?.value || null;
}
//# sourceMappingURL=Doctor.js.map