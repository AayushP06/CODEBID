import pool from "../connection.js";

export class Bid {
    static async create(eventId, teamId, amount) {
        const result = await pool.query(
            "INSERT INTO bids (event_id, team_id, amount) VALUES ($1, $2, $3) RETURNING *",
            [eventId, teamId, amount]
        );
        return result.rows[0];
    }

    static async getByEvent(eventId) {
        const result = await pool.query(
            `SELECT b.*, t.name as team_name 
       FROM bids b 
       JOIN teams t ON b.team_id = t.id 
       WHERE b.event_id = $1 
       ORDER BY b.created_at DESC`,
            [eventId]
        );
        return result.rows;
    }

    static async getHighestBid(eventId) {
        const result = await pool.query(
            `SELECT b.*, t.name as team_name 
       FROM bids b 
       JOIN teams t ON b.team_id = t.id 
       WHERE b.event_id = $1 
       ORDER BY b.amount DESC, b.created_at ASC 
       LIMIT 1`,
            [eventId]
        );
        return result.rows[0];
    }
}
