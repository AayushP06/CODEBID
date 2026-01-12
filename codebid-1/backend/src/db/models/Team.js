import pool from "../connection.js";

export class Team {
    static async findByName(name) {
        const result = await pool.query(
            "SELECT * FROM teams WHERE name = $1",
            [name]
        );
        return result.rows[0];
    }

    static async findByRegistrationNumber(regNo) {
        const result = await pool.query(
            "SELECT * FROM teams WHERE registration_number = $1",
            [regNo]
        );
        return result.rows[0];
    }

    static async create(teamData) {
        const {
            name,
            fullName,
            registrationNumber,
            branch,
            email,
            phone,
            yearOfStudy,
            isAdmin = false
        } = teamData;

        const result = await pool.query(
            `INSERT INTO teams (name, full_name, registration_number, branch, email, phone, year_of_study, coins, is_admin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, fullName, registrationNumber, branch, email, phone, yearOfStudy, 1000, isAdmin]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            "SELECT * FROM teams WHERE id = $1",
            [id]
        );
        return result.rows[0];
    }

    static async updateCoins(id, coins) {
        const result = await pool.query(
            "UPDATE teams SET coins = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            [coins, id]
        );
        return result.rows[0];
    }

    static async getLeaderboard() {
        const result = await pool.query(
            "SELECT id, name, coins, score FROM teams WHERE is_admin = false ORDER BY score DESC, coins DESC LIMIT 10"
        );
        return result.rows;
    }

    static async getAllWithDetails() {
        const result = await pool.query(
            "SELECT * FROM teams ORDER BY created_at DESC"
        );
        return result.rows;
    }
}