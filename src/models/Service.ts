import { getDb } from '../data/mongoConfig.js';
import { ObjectId } from 'mongodb';

export interface Service {
  _id?: ObjectId;
  title: string;
  slug: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'services';

export async function getServicesCollection() {
  const db = getDb();
  return db.collection<Service>(COLLECTION_NAME);
}

export async function createService(payload: {
  title: string;
  slug: string;
  description: string;
}) {
  const collection = await getServicesCollection();
  const doc: Service = {
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function getServiceById(id: string) {
  const collection = await getServicesCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function getServiceBySlug(slug: string) {
  const collection = await getServicesCollection();
  return collection.findOne({ slug });
}

export async function getServiceByTitle(title: string) {
  const collection = await getServicesCollection();
  return collection.findOne({ title });
}

export async function getAllServices() {
  const collection = await getServicesCollection();
  return collection.find({}).toArray();
}

export async function updateService(
  id: string,
  payload: Partial<{ title: string; slug: string; description: string }>
) {
  const collection = await getServicesCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...payload,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );
  return result;
}

export async function deleteService(id: string) {
  const collection = await getServicesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
