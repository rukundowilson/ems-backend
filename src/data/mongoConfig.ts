import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

dotenv.config();

const uri ='mongodb://localhost:27017/';
const dbName = process.env.MONGO_DB || 'ems';
console.log(uri, dbName)

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectMongo(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    db = client.db(dbName);
  }
  if (!db) {
    throw new Error('Failed to initialize database');
  }
  return db;
}





export function getDb(): Db {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongo() first.');
  }
  return db;
}
export async function closeMongo() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}