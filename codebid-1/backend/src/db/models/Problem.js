import pool from "../connection.js";

export class Problem {
  static async getAll() {
    const result = await pool.query(
      "SELECT * FROM problems ORDER BY difficulty, created_at"
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      "SELECT * FROM problems WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async create(title, description, difficulty, testCases, solution) {
    const result = await pool.query(
      "INSERT INTO problems (title, description, difficulty, test_cases, solution) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, difficulty, testCases, solution]
    );
    return result.rows[0];
  }

  static async getRandomByDifficulty(difficulty = 'medium') {
    const result = await pool.query(
      "SELECT * FROM problems WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 1",
      [difficulty]
    );
    return result.rows[0];
  }
}