import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connect to default postgres database first
const adminPool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres",
  password: process.env.DB_PASSWORD || undefined,
  port: process.env.DB_PORT || 5432,
});

// Pool for the actual database
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "codebid",
  password: process.env.DB_PASSWORD || undefined,
  port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
  try {
    console.log("🔧 Setting up database...");
    console.log(`📍 Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`👤 User: ${process.env.DB_USER}`);

    // Create database if it doesn't exist
    console.log("📦 Creating database if not exists...");
    try {
      await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME || "codebid"}`);
      console.log("✅ Database created");
    } catch (err) {
      if (err.code === "42P04") {
        console.log("✅ Database already exists");
      } else {
        throw err;
      }
    }

    // Read and execute SQL files
    const sqlDir = path.join(__dirname, "sql");
    const sqlFiles = fs.readdirSync(sqlDir).filter(f => f.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      console.log(`📄 Executing ${file}...`);
      const sql = fs.readFileSync(path.join(sqlDir, file), "utf-8");
      await pool.query(sql);
      console.log(`✅ ${file} executed`);
    }

    console.log("✅ Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  } finally {
    await adminPool.end();
    await pool.end();
  }
}

setupDatabase();