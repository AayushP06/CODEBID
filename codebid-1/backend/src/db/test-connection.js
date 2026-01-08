import pool from "./connection.js";

async function testConnection() {
  try {
    console.log("🔄 Testing database connection...");
    
    const result = await pool.query("SELECT NOW() as current_time");
    console.log("✅ Database connected successfully!");
    console.log("📅 Current time:", result.rows[0].current_time);
    
    // Test if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log("📋 Existing tables:", tablesResult.rows.map(r => r.table_name).join(", "));
    } else {
      console.log("⚠️  No tables found. Run migrations first: npm run db:migrate");
    }
    
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("1. Make sure PostgreSQL is running");
    console.log("2. Check your .env file database settings");
    console.log("3. Create the 'codebid' database if it doesn't exist");
  } finally {
    await pool.end();
  }
}

testConnection();