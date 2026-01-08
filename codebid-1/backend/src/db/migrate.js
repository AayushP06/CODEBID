import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log("🔄 Running database migrations...");

    // Read and execute init.sql
    const initSql = fs.readFileSync(
      path.join(__dirname, "../../../sql/001_init.sql"),
      "utf8"
    );
    await pool.query(initSql);
    console.log("✅ Schema created successfully");

    // Read and execute seed.sql
    const seedSql = fs.readFileSync(
      path.join(__dirname, "../../../sql/002_seed.sql"),
      "utf8"
    );
    await pool.query(seedSql);
    console.log("✅ Seed data inserted successfully");

    console.log("🎉 Database migrations completed!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations };