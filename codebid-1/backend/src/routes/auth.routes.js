import express from "express";
import jwt from "jsonwebtoken";
import { Team } from "../db/models/Team.js";

const router = express.Router();

// POST /auth/login - Simple login (works for both quick join and admin)
router.post("/login", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Team name is required" });
    }

    const teamName = name.trim();
    let team = await Team.findByName(teamName);

    // Create team if it doesn't exist
    if (!team) {
      const isAdmin = teamName.toLowerCase() === "admin";
      team = await Team.create({
        name: teamName,
        fullName: teamName,
        registrationNumber: null,
        branch: null,
        email: null,
        phone: null,
        yearOfStudy: null,
        isAdmin
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { teamId: team.id, teamName: team.name },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      team: {
        id: team.id,
        name: team.name,
        coins: team.coins,
        isAdmin: team.is_admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/signup - Detailed signup with additional info
router.post("/signup", async (req, res) => {
  try {
    const { 
      teamName, 
      fullName, 
      registrationNumber, 
      branch, 
      email, 
      phone, 
      yearOfStudy 
    } = req.body;

    // Validation
    if (!teamName || !fullName || !registrationNumber || !branch) {
      return res.status(400).json({ 
        error: "Team name, full name, registration number, and branch are required" 
      });
    }

    // Check if team name already exists
    const existingTeam = await Team.findByName(teamName.trim());
    if (existingTeam) {
      return res.status(400).json({ error: "Team name already exists" });
    }

    // Check if registration number already exists
    const existingRegNo = await Team.findByRegistrationNumber(registrationNumber.trim());
    if (existingRegNo) {
      return res.status(400).json({ error: "Registration number already exists" });
    }

    // Create new team with full details
    const team = await Team.create({
      name: teamName.trim(),
      fullName: fullName.trim(),
      registrationNumber: registrationNumber.trim(),
      branch: branch.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : null,
      isAdmin: false
    });

    // Generate JWT token
    const token = jwt.sign(
      { teamId: team.id, teamName: team.name },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      team: {
        id: team.id,
        name: team.name,
        coins: team.coins,
        isAdmin: team.is_admin,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === '23505') {
      return res.status(400).json({ error: "Registration number already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /auth/me
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    const team = await Team.findById(decoded.teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json({
      team: {
        id: team.id,
        name: team.name,
        coins: team.coins,
        isAdmin: team.is_admin,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;

