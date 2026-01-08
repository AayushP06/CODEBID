import pool from "../connection.js";

export class Event {
  static async getCurrentEvent() {
    const result = await pool.query(
      `SELECT e.*, p.title as problem_title, p.description as problem_description, 
              p.difficulty as problem_difficulty, p.test_cases as problem_test_cases,
              t.name as highest_bidder_name
       FROM events e 
       LEFT JOIN problems p ON e.current_problem_id = p.id
       LEFT JOIN teams t ON e.highest_bidder_id = t.id
       ORDER BY e.created_at DESC LIMIT 1`
    );
    return result.rows[0];
  }

  static async updateState(state, problemId = null) {
    const result = await pool.query(
      "UPDATE events SET state = $1, current_problem_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1) RETURNING *",
      [state, problemId]
    );
    return result.rows[0];
  }

  static async updateHighestBid(eventId, teamId, amount) {
    const result = await pool.query(
      "UPDATE events SET highest_bid = $1, highest_bidder_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [amount, teamId, eventId]
    );
    return result.rows[0];
  }

  static async startAuction(problemId) {
    const result = await pool.query(
      "UPDATE events SET state = 'AUCTION', current_problem_id = $1, auction_start_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1) RETURNING *",
      [problemId]
    );
    return result.rows[0];
  }

  static async startCoding() {
    const result = await pool.query(
      "UPDATE events SET state = 'CODING', coding_start_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1) RETURNING *"
    );
    return result.rows[0];
  }
}