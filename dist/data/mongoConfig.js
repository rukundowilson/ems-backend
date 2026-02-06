import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';
dotenv.config();
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'ems';
let client;
let db;
export async function connectMongo() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}
export function getDb() {
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
//# sourceMappingURL=mongoConfig.js.map