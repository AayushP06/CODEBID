import "dotenv/config";
import pool from "./src/db/connection.js";

async function setupEvent() {
    try {
        // Check if event exists
        const check = await pool.query("SELECT COUNT(*) FROM events");
        console.log("Events count:", check.rows[0].count);

        if (check.rows[0].count === '0') {
            // Insert initial event
            await pool.query("INSERT INTO events (state) VALUES ('WAITING')");
            console.log("✅ Created initial event");
        }

        // Show current state
        const state = await pool.query("SELECT * FROM events ORDER BY id DESC LIMIT 1");
        console.log("Current event:", state.rows[0]);

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await pool.end();
    }
}

setupEvent();
