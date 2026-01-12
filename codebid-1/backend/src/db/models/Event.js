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

        const event = result.rows[0];
        if (!event) return null;

        return {
            ...event,
            endsIn: event.auction_timer || 60,
            currentProblem: event.current_problem_id ? {
                id: event.current_problem_id,
                title: event.problem_title,
                description: event.problem_description,
                difficulty: event.problem_difficulty,
                basePoints: event.base_points || 100
            } : null
        };
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

    static async setHighestBidderName(name) {
        // This is handled by the JOIN in getCurrentEvent, no separate update needed
        return true;
    }

    static async startAuction(problemId, timer = 60) {
        const result = await pool.query(
            "UPDATE events SET state = 'AUCTION', current_problem_id = $1, auction_timer = $2, highest_bid = 0, highest_bidder_id = NULL, auction_start_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1) RETURNING *",
            [problemId, timer]
        );
        return result.rows[0];
    }

    static async startCoding() {
        const result = await pool.query(
            "UPDATE events SET state = 'CODING', coding_start_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1) RETURNING *"
        );
        return result.rows[0];
    }

    static async endEvent() {
        const result = await pool.query(
            "UPDATE events SET state = 'FINISHED', updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1) RETURNING *"
        );
        return result.rows[0];
    }
}
