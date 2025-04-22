import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "todo_db";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
