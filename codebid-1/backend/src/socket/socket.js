import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Event } from "../db/models/Event.js";
import { Bid } from "../db/models/Bid.js";
import { Team } from "../db/models/Team.js";

let io = null;
let auctionTimer = null;
let auctionEndTime = null;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
      socket.userId = decoded.teamId;
      socket.teamName = decoded.teamName;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.teamName} (${socket.userId})`);

    socket.on("JOIN_AUCTION", async () => {
      socket.join("auction");
      console.log(`👤 ${socket.teamName} joined auction room`);
      
      // Send current timer value immediately on join
      const timeLeft = getRemainingTime();
      socket.emit("TIMER_UPDATE", { timeLeft });
    });

    socket.on("PLACE_BID", async (data, callback) => {
      try {
        const { amount } = data;

        // Get current event
        const currentEvent = await Event.getCurrentEvent();
        if (!currentEvent || currentEvent.state !== 'AUCTION') {
          return callback({ ok: false, error: "No active auction" });
        }

        // Get team to check coins
        const team = await Team.findById(socket.userId);
        if (!team) {
          return callback({ ok: false, error: "Team not found" });
        }

        // Prevent admin from bidding
        if (team.is_admin) {
          console.log(`🚫 Admin ${socket.teamName} attempted to place bid - REJECTED`);
          return callback({ ok: false, error: "Admin cannot place bids. Only participants can bid." });
        }

        // Validate bid amount - must be strictly greater than current highest bid
        const currentHighestBid = currentEvent.highest_bid || 0;
        console.log(`💰 Bid attempt: Team ${socket.teamName} bidding ${amount}, current highest: ${currentHighestBid}`);
        
        if (amount <= currentHighestBid) {
          return callback({ ok: false, error: `Bid must be higher than ${currentHighestBid}` });
        }

        if (amount > team.coins) {
          return callback({ ok: false, error: "Insufficient coins" });
        }

        // Create bid record
        await Bid.create(currentEvent.id, socket.userId, amount);

        // Update event with new highest bid
        await Event.updateHighestBid(currentEvent.id, socket.userId, amount);
        await Event.setHighestBidderName(socket.teamName);

        console.log(`✅ Bid accepted: Team ${socket.teamName} bid ${amount}`);

        // Get remaining time for broadcast
        const timeLeft = getRemainingTime();

        // Broadcast to all clients in auction room
        io.to("auction").emit("BID_UPDATED", {
          amount: amount,
          teamId: socket.userId,
          teamName: socket.teamName,
          timeLeft: timeLeft,
          currentProblem: {
            id: currentEvent.current_problem_id,
            title: currentEvent.problem_title,
            description: currentEvent.problem_description,
            difficulty: currentEvent.problem_difficulty
          },
          timestamp: new Date().toISOString()
        });

        // Broadcast updated leaderboard to all clients
        const leaderboard = await Team.getLeaderboard();
        io.to("auction").emit("LEADERBOARD_UPDATED", leaderboard);

        callback({ ok: true });
      } catch (error) {
        console.error("Place bid error:", error);
        callback({ ok: false, error: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.teamName}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}

// Auction Timer Management
function startAuctionTimer(durationSeconds) {
  // Clear any existing timer
  if (auctionTimer) {
    clearInterval(auctionTimer);
  }

  auctionEndTime = Date.now() + (durationSeconds * 1000);
  console.log(`🕐 Auction timer started: ${durationSeconds} seconds`);

  auctionTimer = setInterval(async () => {
    const timeLeft = Math.max(0, Math.ceil((auctionEndTime - Date.now()) / 1000));
    
    // Broadcast time update to all clients
    if (io) {
      io.to("auction").emit("TIMER_UPDATE", { timeLeft });
    }

    // End auction when timer reaches 0
    if (timeLeft <= 0) {
      await endCurrentAuction();
    }
  }, 1000);
}

async function endCurrentAuction() {
  if (auctionTimer) {
    clearInterval(auctionTimer);
    auctionTimer = null;
  }

  try {
    const currentEvent = await Event.getCurrentEvent();
    if (!currentEvent || currentEvent.state !== 'AUCTION') {
      return;
    }

    console.log(`🏁 Auction ended for problem ${currentEvent.current_problem_id}`);

    // Deduct coins from winning team if there was a winner
    if (currentEvent.highest_bidder_id && currentEvent.highest_bid > 0) {
      const winningTeam = await Team.findById(currentEvent.highest_bidder_id);
      if (winningTeam) {
        const newCoinBalance = winningTeam.coins - currentEvent.highest_bid;
        await Team.updateCoins(currentEvent.highest_bidder_id, newCoinBalance);
        
        // Award points based on problem difficulty
        const basePoints = currentEvent.base_points || 100;
        const difficultyMultiplier = currentEvent.problem_difficulty === 'Hard' ? 1.5 : 
                                   currentEvent.problem_difficulty === 'Medium' ? 1.2 : 1.0;
        const pointsAwarded = Math.floor(basePoints * difficultyMultiplier);
        
        await Team.incrementScore(currentEvent.highest_bidder_id, pointsAwarded);
        
        console.log(`💰 Deducted ${currentEvent.highest_bid} coins from team ${currentEvent.highest_bidder_name}. New balance: ${newCoinBalance}`);
        console.log(`🏆 Awarded ${pointsAwarded} points to team ${currentEvent.highest_bidder_name}`);
        
        // Broadcast wallet update to the winning team
        if (io) {
          io.to("auction").emit("WALLET_UPDATED", {
            teamId: currentEvent.highest_bidder_id,
            newBalance: newCoinBalance,
            deducted: currentEvent.highest_bid,
            pointsAwarded: pointsAwarded,
            reason: `Won problem: ${currentEvent.problem_title}`
          });
        }
      }
    }

    // Update event state to COMPLETED
    await Event.updateState('COMPLETED');

    // Broadcast auction end to all clients
    if (io) {
      const winnerData = {
        winnerTeamName: currentEvent.highest_bidder_name,
        amount: currentEvent.highest_bid,
        problemTitle: currentEvent.problem_title
      };

      io.to("auction").emit("AUCTION_ENDED", winnerData);
      
      // Broadcast updated leaderboard after points are awarded
      const leaderboard = await Team.getLeaderboard();
      io.to("auction").emit("LEADERBOARD_UPDATED", leaderboard);
      
      // Broadcast state change
      const eventState = await Event.getCurrentEvent();
      io.emit("STATE_CHANGED", eventState);
    }
  } catch (error) {
    console.error("Error ending auction:", error);
  }
}

function getRemainingTime() {
  if (!auctionEndTime) return 0;
  return Math.max(0, Math.ceil((auctionEndTime - Date.now()) / 1000));
}

export { startAuctionTimer, endCurrentAuction, getRemainingTime };

