import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Event } from "../db/models/Event.js";
import { Bid } from "../db/models/Bid.js";
import { Team } from "../db/models/Team.js";

let io = null;

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

    socket.on("JOIN_AUCTION", () => {
      socket.join("auction");
      console.log(`👤 ${socket.teamName} joined auction room`);
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

        // Validate bid amount
        if (amount <= currentEvent.highest_bid) {
          return callback({ ok: false, error: "Bid must be higher than current highest bid" });
        }

        if (amount > team.coins) {
          return callback({ ok: false, error: "Insufficient coins" });
        }

        // Create bid record
        await Bid.create(currentEvent.id, socket.userId, amount);

        // Update event with new highest bid
        await Event.updateHighestBid(currentEvent.id, socket.userId, amount);
        await Event.setHighestBidderName(socket.teamName);

        // Broadcast to all clients in auction room
        io.to("auction").emit("BID_UPDATED", {
          amount: amount,
          teamId: socket.userId,
          teamName: socket.teamName,
          timestamp: new Date().toISOString()
        });

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

