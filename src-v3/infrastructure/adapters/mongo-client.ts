import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_CONNECTIONSTRING || process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_NAME;

let client: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Missing MONGO_DB_CONNECTIONSTRING or MONGO_DB_URL.");
  }
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export async function getMongoDb() {
  if (!dbName) {
    throw new Error("Missing MONGO_DB_NAME.");
  }
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}
