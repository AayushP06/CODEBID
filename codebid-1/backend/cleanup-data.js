import "dotenv/config";
import pool from "./src/db/connection.js";

async function cleanupData() {
  try {
    console.log("🗑️  Starting data cleanup...\n");

    // Option 1: Delete all data but keep tables
    console.log("📋 Deleting all user data...");
    
    // Delete bids first (foreign key constraint)
    await pool.query("DELETE FROM bids");
    console.log("✅ Deleted all bids");

    // Delete events
    await pool.query("DELETE FROM events");
    console.log("✅ Deleted all events");

    // Delete teams (except admin if you want to keep it)
    await pool.query("DELETE FROM teams WHERE is_admin = false");
    console.log("✅ Deleted all non-admin teams");

    // Delete problems
    await pool.query("DELETE FROM problems");
    console.log("✅ Deleted all problems");

    console.log("\n✅ Data cleanup completed successfully!");
    console.log("\n📊 Current data status:");
    
    // Show remaining data
    const teamsResult = await pool.query("SELECT COUNT(*) as count FROM teams");
    const problemsResult = await pool.query("SELECT COUNT(*) as count FROM problems");
    const eventsResult = await pool.query("SELECT COUNT(*) as count FROM events");
    const bidsResult = await pool.query("SELECT COUNT(*) as count FROM bids");

    console.log(`   Teams: ${teamsResult.rows[0].count}`);
    console.log(`   Problems: ${problemsResult.rows[0].count}`);
    console.log(`   Events: ${eventsResult.rows[0].count}`);
    console.log(`   Bids: ${bidsResult.rows[0].count}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
}

// Run cleanup
cleanupData();
