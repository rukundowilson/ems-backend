import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';

export interface Booking {
  _id?: ObjectId;
  doctorId: string;
  patientId?: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  patientEmail?: string;
  patientName?: string;
  patientPhone?: string;
  paymentMethod?: string;
  amount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'bookings';

export async function getBookingsCollection() {
  const db = getDb();
  return db.collection<Booking>(COLLECTION_NAME);
}

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
export async function getAllBookings() {
  const collection = await getBookingsCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

<<<<<<< Updated upstream
export async function getBookingsByPatient(patientId: string) {
  const collection = await getBookingsCollection();
  return collection.find({ patientId }).sort({ createdAt: -1 }).toArray();
=======
export async function getBookingById(id: string) {
  const collection = await getBookingsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
>>>>>>> Stashed changes
}

export async function getBookingsByDoctor(doctorId: string) {
  const collection = await getBookingsCollection();
<<<<<<< Updated upstream
  return collection.find({ doctorId }).sort({ createdAt: -1 }).toArray();
}

export async function getBookingById(id: string) {
  const collection = await getBookingsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
=======
  return collection.find({ doctorId }).toArray();
}

export async function getBookingsByPatient(patientId: string) {
  const collection = await getBookingsCollection();
  return collection.find({ patientId }).toArray();
}

export async function createBooking(booking: Omit<Booking, '_id'>) {
  const collection = await getBookingsCollection();
  const doc: Booking = {
    ...booking,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
>>>>>>> Stashed changes
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
