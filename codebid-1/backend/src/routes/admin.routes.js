import express from "express";
import jwt from "jsonwebtoken";
import { getIO } from "../socket/socket.js";
import { Event } from "../db/models/Event.js";
import { Problem } from "../db/models/Problem.js";
import { Team } from "../db/models/Team.js";
import pool from "../db/connection.js";

const router = express.Router();

// Middleware to check if user is admin
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    const team = await Team.findById(decoded.teamId);
    if (!team || !team.is_admin) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// POST /admin/start-auction
router.post("/start-auction", requireAdmin, async (req, res) => {
  try {
    const { problemId, timer = 60 } = req.body;

    let selectedProblemId = problemId;
    if (!selectedProblemId) {
      // Get a random problem if none specified
      const randomProblem = await Problem.getRandomByDifficulty('medium');
      selectedProblemId = randomProblem?.id;
    }

    if (!selectedProblemId) {
      return res.status(400).json({ error: "No problems available" });
    }

    const event = await Event.startAuction(selectedProblemId, timer);

    // Broadcast state change via socket
    const io = getIO();
    if (io) {
      const eventState = await Event.getCurrentEvent();
      eventState.endsIn = timer; // Include timer in broadcast
      io.emit("STATE_CHANGED", eventState);
    }

    res.json({ ok: true, event });
  } catch (error) {
    console.error("Start auction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/start-coding
router.post("/start-coding", requireAdmin, async (req, res) => {
  try {
    const event = await Event.startCoding();

    // Broadcast state change via socket
    const io = getIO();
    if (io) {
      const eventState = await Event.getCurrentEvent();
      io.emit("STATE_CHANGED", eventState);
    }

    res.json({ ok: true, event });
  } catch (error) {
    console.error("Start coding error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/leaderboard
router.get("/leaderboard", requireAdmin, async (req, res) => {
  try {
    const leaderboard = await Team.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/teams - View all registered teams
router.get("/teams", requireAdmin, async (req, res) => {
  try {
    const teams = await Team.getAllWithDetails();
    res.json(teams);
  } catch (error) {
    console.error("Get teams error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/problems - View all problems
router.get("/problems", requireAdmin, async (req, res) => {
  try {
    const problems = await Problem.getAll();
    res.json(problems);
  } catch (error) {
    console.error("Get problems error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/problems - Add new problem
router.post("/problems", requireAdmin, async (req, res) => {
  try {
    const { title, description, difficulty, testCases, solution } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const problem = await Problem.create(
      title,
      description,
      difficulty || 'medium',
      testCases || [],
      solution || ''
    );

    res.json(problem);
  } catch (error) {
    console.error("Create problem error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /admin/problems/:id - Delete problem
router.delete("/problems/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM problems WHERE id = $1", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Delete problem error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/reset-event
router.post("/reset-event", requireAdmin, async (req, res) => {
  try {
    const event = await Event.updateState('WAITING', null);

    // Broadcast state change via socket
    const io = getIO();
    if (io) {
      const eventState = await Event.getCurrentEvent();
      io.emit("STATE_CHANGED", eventState);
    }

    res.json({ ok: true, event });
  } catch (error) {
    console.error("Reset event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

