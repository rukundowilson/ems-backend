import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';

export interface CompletionLog {
  _id?: ObjectId;
  bookingId: string;        // Reference to the booking
  doctorId: string;         // Doctor who completed it
  patientId?: string;       // Patient ID
  patientName?: string;     // Patient name at time of completion
  service: string;          // Service name
  appointmentDate: string;  // Original appointment date
  completedAt: Date;        // When it was marked complete
  notes?: string;           // Optional completion notes
  rating?: number;          // Optional patient rating (1-5)
  createdAt?: Date;
}

const COLLECTION_NAME = 'completion_logs';

export async function getCompletionLogsCollection() {
  const db = getDb();
  return db.collection<CompletionLog>(COLLECTION_NAME);
}

export async function createCompletionLog(payload: {
  bookingId: string;
  doctorId: string;
  patientId?: string;
  patientName?: string;
  service: string;
  appointmentDate: string;
  notes?: string;
  rating?: number;
}) {
  const collection = await getCompletionLogsCollection();
  const doc: any = {
    bookingId: payload.bookingId,
    doctorId: payload.doctorId,
    patientName: payload.patientName,
    service: payload.service,
    appointmentDate: payload.appointmentDate,
    completedAt: new Date(),
    createdAt: new Date(),
  };

  if (payload.patientId !== undefined) doc.patientId = payload.patientId;
  if (payload.notes !== undefined) doc.notes = payload.notes;
  if (payload.rating !== undefined) doc.rating = payload.rating;

  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function getCompletionLogsByDoctorId(doctorId: string) {
  const collection = await getCompletionLogsCollection();
  return collection.find({ doctorId }).sort({ completedAt: -1 }).toArray();
}

export async function getCompletionLogsByPatientId(patientId: string) {
  const collection = await getCompletionLogsCollection();
  return collection.find({ patientId }).sort({ completedAt: -1 }).toArray();
}

export async function getDoctorCompletionStats(doctorId: string) {
  const collection = await getCompletionLogsCollection();
  
  const logs = await collection
    .find({ doctorId })
    .toArray();

  const totalCompleted = logs.length;
  const avgRating = logs.length > 0
    ? logs.reduce((sum, log) => sum + (log.rating || 0), 0) / logs.length
    : 0;

  return {
    totalCompleted,
    avgRating: Math.round(avgRating * 10) / 10,
    recentCompletions: logs.slice(0, 10),
  };
}

export async function getCompletionLogByBookingId(bookingId: string) {
  const collection = await getCompletionLogsCollection();
  return collection.findOne({ bookingId });
}
