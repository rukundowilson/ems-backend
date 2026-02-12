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
export async function getAvailabilityByService(serviceSlug) {
    const db = getDb();
    // Look up service by slug to get the title
    const servicesCollection = db.collection('services');
    const service = await servicesCollection.findOne({ slug: serviceSlug });
    if (!service) {
        return [];
    }
    const serviceTitle = service.title;
    // Find all doctors and match by service id/title/slug to handle mixed storage
    const patientsCollection = db.collection('patients');
    const doctors = await patientsCollection.find({ role: 'doctor' }).toArray();
    const svcId = String(service._id);
    const doctorIds = [];
    for (const d of doctors) {
        const svcList = Array.isArray(d.services) ? d.services : [];
        const matched = svcList.some((s) => {
            if (!s)
                return false;
            if (typeof s === 'string') {
                return s === svcId || s === serviceTitle || s === serviceSlug;
            }
            if (typeof s === 'object') {
                if (s._id)
                    return String(s._id) === svcId;
                if (s.id)
                    return String(s.id) === svcId;
            }
            return false;
        });
        if (matched)
            doctorIds.push(String(d._id));
    }
    if (doctorIds.length === 0)
        return [];
    // Get all availability slots for these doctors
    const collection = await getAvailabilityCollection();
    return collection
        .find({ doctorId: { $in: doctorIds } })
        .sort({ date: 1, start: 1 })
        .toArray();
}
export async function getAvailabilityByServiceId(serviceId) {
    const db = getDb();
    // Look up service by ID
    const servicesCollection = db.collection('services');
    let service;
    try {
        service = await servicesCollection.findOne({ _id: new ObjectId(serviceId) });
    }
    catch (e) {
        // If not a valid ObjectId, try as string
        service = await servicesCollection.findOne({ _id: serviceId });
    }
    if (!service) {
        return [];
    }
    const serviceTitle = service.title;
    const svcId = String(service._id);
    // Find all doctors that have this service
    const patientsCollection = db.collection('patients');
    const doctors = await patientsCollection.find({ role: 'doctor' }).toArray();
    const doctorIds = [];
    for (const d of doctors) {
        const svcList = Array.isArray(d.services) ? d.services : [];
        const matched = svcList.some((s) => {
            if (!s)
                return false;
            // Check if service matches by ID or by reference
            if (typeof s === 'string') {
                return s === svcId || s === serviceId;
            }
            if (typeof s === 'object') {
                if (s._id)
                    return String(s._id) === svcId || String(s._id) === serviceId;
                if (s.id)
                    return String(s.id) === svcId || String(s.id) === serviceId;
            }
            return false;
        });
        if (matched)
            doctorIds.push(String(d._id));
    }
    if (doctorIds.length === 0)
        return [];
    // Get all availability slots for these doctors
    const collection = await getAvailabilityCollection();
    return collection
        .find({ doctorId: { $in: doctorIds } })
        .sort({ date: 1, start: 1 })
        .toArray();
}
//# sourceMappingURL=Availability.js.map