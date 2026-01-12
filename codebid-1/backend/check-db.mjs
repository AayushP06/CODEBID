import pool from "./src/db/connection.js";

async function checkTeams() {
    try {
        const result = await pool.query("SELECT id, name, coins, is_admin, created_at FROM teams ORDER BY id DESC LIMIT 10");
        console.log("=== Teams in PostgreSQL Database ===");
        console.table(result.rows);
        console.log(`\nTotal teams found: ${result.rows.length}`);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await pool.end();
    }
}

checkTeams();
