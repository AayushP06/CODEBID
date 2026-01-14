import "dotenv/config";
import pool from "./src/db/connection.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function showMenu() {
  console.log("\n🗑️  DATABASE CLEANUP OPTIONS\n");
  console.log("1. Delete all user data (keep tables)");
  console.log("2. Delete all teams (non-admin)");
  console.log("3. Delete all problems");
  console.log("4. Delete all bids");
  console.log("5. Delete all events");
  console.log("6. Delete EVERYTHING (full reset)");
  console.log("7. Show current data count");
  console.log("8. Exit\n");

  const choice = await question("Select option (1-8): ");
  return choice;
}

async function showDataCount() {
  try {
    const teamsResult = await pool.query("SELECT COUNT(*) as count FROM teams");
    const problemsResult = await pool.query("SELECT COUNT(*) as count FROM problems");
    const eventsResult = await pool.query("SELECT COUNT(*) as count FROM events");
    const bidsResult = await pool.query("SELECT COUNT(*) as count FROM bids");

    console.log("\n📊 Current Database Status:");
    console.log(`   Teams: ${teamsResult.rows[0].count}`);
    console.log(`   Problems: ${problemsResult.rows[0].count}`);
    console.log(`   Events: ${eventsResult.rows[0].count}`);
    console.log(`   Bids: ${bidsResult.rows[0].count}\n`);
  } catch (error) {
    console.error("❌ Error fetching data count:", error.message);
  }
}

async function deleteAllUserData() {
  try {
    console.log("\n🗑️  Deleting all user data...");
    await pool.query("DELETE FROM bids");
    console.log("✅ Deleted all bids");
    await pool.query("DELETE FROM events");
    console.log("✅ Deleted all events");
    await pool.query("DELETE FROM teams WHERE is_admin = false");
    console.log("✅ Deleted all non-admin teams");
    await pool.query("DELETE FROM problems");
    console.log("✅ Deleted all problems");
    console.log("✅ All user data deleted!\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function deleteTeams() {
  try {
    console.log("\n🗑️  Deleting all non-admin teams...");
    const result = await pool.query("DELETE FROM teams WHERE is_admin = false RETURNING id");
    console.log(`✅ Deleted ${result.rowCount} teams\n`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function deleteProblems() {
  try {
    console.log("\n🗑️  Deleting all problems...");
    const result = await pool.query("DELETE FROM problems RETURNING id");
    console.log(`✅ Deleted ${result.rowCount} problems\n`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function deleteBids() {
  try {
    console.log("\n🗑️  Deleting all bids...");
    const result = await pool.query("DELETE FROM bids RETURNING id");
    console.log(`✅ Deleted ${result.rowCount} bids\n`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function deleteEvents() {
  try {
    console.log("\n🗑️  Deleting all events...");
    const result = await pool.query("DELETE FROM events RETURNING id");
    console.log(`✅ Deleted ${result.rowCount} events\n`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function deleteEverything() {
  try {
    const confirm = await question("⚠️  This will delete ALL data! Are you sure? (yes/no): ");
    if (confirm.toLowerCase() !== "yes") {
      console.log("❌ Cancelled\n");
      return;
    }

    console.log("\n🗑️  Deleting ALL data...");
    await pool.query("DELETE FROM bids");
    console.log("✅ Deleted all bids");
    await pool.query("DELETE FROM events");
    console.log("✅ Deleted all events");
    await pool.query("DELETE FROM teams");
    console.log("✅ Deleted all teams");
    await pool.query("DELETE FROM problems");
    console.log("✅ Deleted all problems");
    console.log("✅ FULL DATABASE RESET COMPLETE!\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function main() {
  console.log("\n🔧 CodeBid Database Cleanup Tool\n");

  let running = true;
  while (running) {
    const choice = await showMenu();

    switch (choice) {
      case "1":
        await deleteAllUserData();
        break;
      case "2":
        await deleteTeams();
        break;
      case "3":
        await deleteProblems();
        break;
      case "4":
        await deleteBids();
        break;
      case "5":
        await deleteEvents();
        break;
      case "6":
        await deleteEverything();
        break;
      case "7":
        await showDataCount();
        break;
      case "8":
        console.log("👋 Goodbye!\n");
        running = false;
        break;
      default:
        console.log("❌ Invalid option\n");
    }
  }

  rl.close();
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
