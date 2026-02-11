import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';

export interface Patient {
  _id?: ObjectId;
  email?: string | undefined;
  name?: string | undefined;
  phone?: string | undefined;
  firebaseUid?: string | undefined;
  passwordHash?: string | undefined;
  role?: 'patient' | 'doctor' | 'admin';
  services?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'patients';

export async function getPatientsCollection() {
  const db = getDb();
  return db.collection<Patient>(COLLECTION_NAME);
}

export async function createPatient(payload: { firebaseUid?: string | undefined; email?: string | undefined; name?: string | undefined; phone?: string | undefined; passwordHash?: string | undefined; role?: 'patient' | 'doctor' | 'admin'; services?: string[] }) {
  const collection = await getPatientsCollection();
  const doc: Patient = {
    firebaseUid: payload.firebaseUid || undefined,
    email: payload.email,
    name: payload.name,
    phone: payload.phone,
    passwordHash: payload.passwordHash || undefined,
    role: payload.role || 'patient',
    services: (payload as any).services || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function getPatientByFirebaseUid(uid: string) {
  const collection = await getPatientsCollection();
  return collection.findOne({ firebaseUid: uid });
}

export async function getPatientByEmail(email: string) {
  const collection = await getPatientsCollection();
  return collection.findOne({ email });
}

export async function getPatientById(id: string) {
  const collection = await getPatientsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function getAllPatients() {
  const collection = await getPatientsCollection();
  return collection.find({}).toArray();
}

export async function getPatientsByRole(role: 'patient' | 'doctor' | 'admin') {
  const collection = await getPatientsCollection();
  return collection.find({ role }).toArray();
}

export async function updatePatient(id: string, updates: Partial<Patient>) {
  const collection = await getPatientsCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result || null;
}

export async function deletePatient(id: string) {
  const collection = await getPatientsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
