import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.json({ 
  message: "CodeBid Backend API", 
  endpoints: {
    health: "/health",
    auth: "/auth/login, /auth/me",
    event: "/event/state", 
    admin: "/admin/start-auction, /admin/start-coding"
  }
}));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/event", eventRoutes);
app.use("/admin", adminRoutes);

export default app;
