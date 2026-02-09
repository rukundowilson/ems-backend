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
