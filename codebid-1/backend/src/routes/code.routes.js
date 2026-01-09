import express from "express";
import jwt from "jsonwebtoken";
import { CodeExecutor } from "../services/codeExecutor.js";
import { Team } from "../db/models/Team.js";

const router = express.Router();

// Middleware to verify authentication
async function requireAuth(req, res, next) {
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

    req.user = decoded;
    req.team = team;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// POST /code/run - Run code and test against test cases
router.post("/run", requireAuth, async (req, res) => {
  try {
    const { code, language, problemId, testCases } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    // Execute code
    const result = await CodeExecutor.runCode(code, language, testCases || []);

    res.json({
      success: true,
      output: result.output,
      testResults: result.testResults,
      error: result.error
    });
  } catch (error) {
    console.error("Code run error:", error);
    res.status(500).json({ error: "Failed to run code" });
  }
});

// POST /code/submit - Submit solution
router.post("/submit", requireAuth, async (req, res) => {
  try {
    const { code, language, problemId, testCases, eventId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ error: "Code, language, and problemId are required" });
    }

    // Submit and evaluate code
    const result = await CodeExecutor.submitCode(
      code,
      language,
      problemId,
      req.user.teamId,
      testCases || []
    );

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // TODO: Save submission to database
    // await Submission.create({
    //   eventId,
    //   teamId: req.user.teamId,
    //   problemId,
    //   code,
    //   language,
    //   status: result.score === 100 ? 'passed' : 'partial',
    //   testResults: result.testResults
    // });

    // TODO: Update team score/coins if needed
    // if (result.score === 100) {
    //   await Team.updateCoins(req.user.teamId, req.team.coins + 100);
    // }

    res.json({
      success: true,
      message: result.message,
      score: result.score,
      testResults: result.testResults,
      output: result.output
    });
  } catch (error) {
    console.error("Code submit error:", error);
    res.status(500).json({ error: "Failed to submit code" });
  }
});

// GET /code/submissions - Get user's submissions
router.get("/submissions", requireAuth, async (req, res) => {
  try {
    // TODO: Fetch from database
    // const submissions = await Submission.findByTeamId(req.user.teamId);
    
    res.json({
      submissions: []
    });
  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;
