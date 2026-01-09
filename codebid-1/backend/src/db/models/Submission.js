import pool from "../connection.js";

export class Submission {
  static async create(eventId, teamId, problemId, code, language, status, testResults) {
    try {
      const result = await pool.query(
        `INSERT INTO submissions (event_id, team_id, problem_id, code, language, status, test_results) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [eventId, teamId, problemId, code, language, status, JSON.stringify(testResults)]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Create submission error:", error);
      return null;
    }
  }

  static async findByTeamId(teamId) {
    try {
      const result = await pool.query(
        `SELECT * FROM submissions WHERE team_id = $1 ORDER BY submitted_at DESC`,
        [teamId]
      );
      return result.rows;
    } catch (error) {
      console.error("Find submissions error:", error);
      return [];
    }
  }

  static async findByEventAndTeam(eventId, teamId) {
    try {
      const result = await pool.query(
        `SELECT * FROM submissions WHERE event_id = $1 AND team_id = $2 ORDER BY submitted_at DESC`,
        [eventId, teamId]
      );
      return result.rows;
    } catch (error) {
      console.error("Find submissions error:", error);
      return [];
    }
  }

  static async getLeaderboardByEvent(eventId) {
    try {
      const result = await pool.query(
        `SELECT 
          t.id, t.name, 
          COUNT(s.id) as submissions_count,
          SUM(CASE WHEN s.status = 'passed' THEN 1 ELSE 0 END) as passed_count,
          MAX(CASE WHEN s.status = 'passed' THEN s.submitted_at END) as last_passed_at
         FROM teams t
         LEFT JOIN submissions s ON t.id = s.team_id AND s.event_id = $1
         WHERE t.is_admin = false
         GROUP BY t.id, t.name
         ORDER BY passed_count DESC, last_passed_at ASC`,
        [eventId]
      );
      return result.rows;
    } catch (error) {
      console.error("Get leaderboard error:", error);
      return [];
    }
  }
}
