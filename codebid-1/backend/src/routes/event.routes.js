import express from "express";
import { Event } from "../db/models/Event.js";
import { Problem } from "../db/models/Problem.js";

const router = express.Router();

// GET /event/state
router.get("/state", async (req, res) => {
  try {
    const event = await Event.getCurrentEvent();
    
    if (!event) {
      return res.status(404).json({ error: "No active event found" });
    }

    // Calculate remaining time if auction is active
    let endsIn = 0;
    if (event.state === 'AUCTION' && event.auction_start_time) {
      const elapsedSeconds = Math.floor((Date.now() - new Date(event.auction_start_time).getTime()) / 1000);
      endsIn = Math.max(0, (event.auction_timer || 60) - elapsedSeconds);
    }

    const response = {
      state: event.state,
      currentProblem: event.current_problem_id ? {
        id: event.current_problem_id,
        title: event.problem_title,
        description: event.problem_description,
        difficulty: event.problem_difficulty,
        testCases: event.problem_test_cases
      } : null,
      highestBid: event.highest_bid || 0,
      highestTeamId: event.highest_bidder_id || null,
      highestBidderName: event.highest_bidder_name || null,
      auctionStartTime: event.auction_start_time,
      codingStartTime: event.coding_start_time,
      codingEndTime: event.coding_end_time,
      endsIn: endsIn
    };

    res.json(response);
  } catch (error) {
    console.error("Get state error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /event/problems
router.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.getAll();
    res.json(problems);
  } catch (error) {
    console.error("Get problems error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

