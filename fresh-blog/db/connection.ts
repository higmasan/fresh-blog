import { MongoClient, Database } from "https://deno.land/x/mongo@v0.34.0/mod.ts";

let db: Database;

export async function connectDB() {
  if (db) return db;

  const client = new MongoClient();
  const MONGODB_URI = Deno.env.get("MONGODB_URI") || "mongodb://localhost:27017";
  
  try {
    await client.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    db = client.database("fresh-blog-dev-cluster");
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
} 