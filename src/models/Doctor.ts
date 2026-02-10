import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';

export interface Doctor {
  _id?: ObjectId;
  email: string;
  name: string;
  phone: string;
  passwordHash?: string;
  specialization?: string;
  experience?: number;
  qualification?: string;
  role: 'doctor';
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'patients';

export async function getDoctorsCollection() {
  const db = getDb();
  return db.collection<Doctor>(COLLECTION_NAME);
}

export async function getAllDoctors() {
  const collection = await getDoctorsCollection();
  return collection.find({ role: 'doctor' }).toArray();
}

export async function getDoctorById(id: string) {
  const collection = await getDoctorsCollection();
  return collection.findOne({ _id: new ObjectId(id), role: 'doctor' });
}

export async function getDoctorByEmail(email: string) {
  const collection = await getDoctorsCollection();
  return collection.findOne({ email, role: 'doctor' });
}

export async function updateDoctor(id: string, updates: Partial<Doctor>) {
  const collection = await getDoctorsCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id), role: 'doctor' },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result || null;
}

export async function deleteDoctor(id: string) {
  const collection = await getDoctorsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id), role: 'doctor' });
  return result.deletedCount > 0;
}
