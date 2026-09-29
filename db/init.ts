// Initialize the SQLite database (creates tables if missing).
// Run: npm run db:push
import { db } from "../lib/db";

db.init();
console.log("Database ready.");
