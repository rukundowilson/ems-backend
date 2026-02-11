import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';

export interface Availability {
  _id?: ObjectId;
  doctorId: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string; // HH:MM
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'availabilities';

export async function getAvailabilityCollection() {
  const db = getDb();
  return db.collection<Availability>(COLLECTION_NAME);
}

export async function getDoctorAvailability(doctorId: string): Promise<Availability[]> {
  const collection = await getAvailabilityCollection();
  return collection.find({ doctorId }).sort({ date: 1, start: 1 }).toArray();
}

export async function getAvailabilityByDate(doctorId: string, date: string): Promise<Availability[]> {
  const collection = await getAvailabilityCollection();
  return collection.find({ doctorId, date }).sort({ start: 1 }).toArray();
}

export async function createAvailability(doctorId: string, availability: Omit<Availability, '_id' | 'doctorId'>): Promise<Availability> {
  const collection = await getAvailabilityCollection();
  const doc: Availability = {
    doctorId,
    ...availability,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function createBulkAvailability(doctorId: string, availabilities: Omit<Availability, '_id' | 'doctorId'>[]): Promise<Availability[]> {
  const collection = await getAvailabilityCollection();
  const docs: Availability[] = availabilities.map((av) => ({
    doctorId,
    ...av,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const result = await collection.insertMany(docs);
  return docs.map((doc, i) => ({ ...doc, _id: result.insertedIds[i] as ObjectId }));
}

export async function updateAvailability(id: string, updates: Partial<Availability>): Promise<Availability | null> {
  const collection = await getAvailabilityCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result || null;
}

export async function deleteAvailability(id: string): Promise<boolean> {
  const collection = await getAvailabilityCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function deleteAvailabilityByDate(doctorId: string, date: string): Promise<number> {
  const collection = await getAvailabilityCollection();
  const result = await collection.deleteMany({ doctorId, date });
  return result.deletedCount;
}

export async function getAvailabilityByService(serviceSlug: string): Promise<Availability[]> {
  const db = getDb();
  
  // Look up service by slug to get the title
  const servicesCollection = db.collection('services');
  const service = await servicesCollection.findOne({ slug: serviceSlug });
  
  if (!service) {
    return [];
  }
  
  const serviceTitle = service.title as string;
  
  // Find all doctors and match by service id/title/slug to handle mixed storage
  const patientsCollection = db.collection('patients');
  const doctors = await patientsCollection.find({ role: 'doctor' }).toArray();

  const svcId = String(service._id);
  const doctorIds: string[] = [];

  for (const d of doctors) {
    const svcList = Array.isArray(d.services) ? d.services : [];
    const matched = svcList.some((s: any) => {
      if (!s) return false;
      if (typeof s === 'string') {
        return s === svcId || s === serviceTitle || s === serviceSlug;
      }
      if (typeof s === 'object') {
        if (s._id) return String(s._id) === svcId;
        if (s.id) return String(s.id) === svcId;
      }
      return false;
    });
    if (matched) doctorIds.push(String(d._id));
  }

  if (doctorIds.length === 0) return [];

  // Get all availability slots for these doctors
  const collection = await getAvailabilityCollection();
  return collection
    .find({ doctorId: { $in: doctorIds } })
    .sort({ date: 1, start: 1 })
    .toArray();
}

export async function getAvailabilityByServiceId(serviceId: string): Promise<Availability[]> {
  const db = getDb();
  
  // Look up service by ID
  const servicesCollection = db.collection('services');
  let service;
  try {
    service = await servicesCollection.findOne({ _id: new ObjectId(serviceId) });
  } catch (e) {
    // If not a valid ObjectId, try as string
    service = await servicesCollection.findOne({ _id: serviceId as any });
  }
  
  if (!service) {
    return [];
  }
  
  const serviceTitle = service.title as string;
  const svcId = String(service._id);
  
  // Find all doctors that have this service
  const patientsCollection = db.collection('patients');
  const doctors = await patientsCollection.find({ role: 'doctor' }).toArray();

  const doctorIds: string[] = [];

  for (const d of doctors) {
    const svcList = Array.isArray(d.services) ? d.services : [];
    const matched = svcList.some((s: any) => {
      if (!s) return false;
      // Check if service matches by ID or by reference
      if (typeof s === 'string') {
        return s === svcId || s === serviceId;
      }
      if (typeof s === 'object') {
        if (s._id) return String(s._id) === svcId || String(s._id) === serviceId;
        if (s.id) return String(s.id) === svcId || String(s.id) === serviceId;
      }
      return false;
    });
    if (matched) doctorIds.push(String(d._id));
  }

  if (doctorIds.length === 0) return [];

  // Get all availability slots for these doctors
  const collection = await getAvailabilityCollection();
  return collection
    .find({ doctorId: { $in: doctorIds } })
    .sort({ date: 1, start: 1 })
    .toArray();
}
