import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';

export interface Booking {
  _id?: ObjectId;
  doctorId: string;
  patientId?: string;
  service: string;
  date: string;
  time: string;
  patientEmail?: string;
  patientName?: string;
  patientPhone?: string;
  paymentMethod?: string;
  amount?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'bookings';

export async function getBookingsCollection() {
  const db = getDb();
  return db.collection<Booking>(COLLECTION_NAME);
}

export async function createBooking(payload: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>) {
  const collection = await getBookingsCollection();
  const doc: Booking = {
    ...payload,
    status: payload.status || 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function getAllBookings() {
  const collection = await getBookingsCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

export async function getBookingsByPatient(patientId: string) {
  const collection = await getBookingsCollection();
  return collection.find({ patientId }).sort({ createdAt: -1 }).toArray();
}

export async function getBookingsByDoctor(doctorId: string) {
  const collection = await getBookingsCollection();
  return collection.find({ doctorId }).sort({ createdAt: -1 }).toArray();
}

export async function getBookingById(id: string) {
  const collection = await getBookingsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updateBooking(id: string, updates: Partial<Booking>) {
  const collection = await getBookingsCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result || null;
}

export async function deleteBooking(id: string) {
  const collection = await getBookingsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
