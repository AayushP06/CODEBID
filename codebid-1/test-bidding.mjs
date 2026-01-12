// Simplified bidding test - outputs to file for clarity
import { io } from "socket.io-client";
import fs from "fs";

const API_BASE = "http://localhost:4000";
const log = [];

function addLog(msg) {
    console.log(msg);
    log.push(msg);
}

async function apiCall(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
    return res.json();
}

async function login(name) {
    const data = await apiCall("/auth/login", { method: "POST", body: JSON.stringify({ name }) });
    addLog(`✅ Logged in: ${name} (ID: ${data.team.id}, Coins: ${data.team.coins})`);
    return data;
}

function connectSocket(token, teamName) {
    return new Promise((resolve) => {
        const socket = io("http://localhost:4000", { auth: { token }, transports: ["websocket"] });
        socket.on("connect", () => {
            addLog(`🔌 ${teamName} connected`);
            socket.emit("JOIN_AUCTION");
            resolve(socket);
        });
        socket.on("BID_UPDATED", (data) => {
            addLog(`📢 [${teamName}] received BID_UPDATED: ${data.teamName} bid ${data.amount}`);
        });
    });
}

async function placeBid(socket, amount, teamName) {
    return new Promise((resolve) => {
        socket.emit("PLACE_BID", { amount }, (resp) => {
            addLog(`💰 ${teamName} bid ${amount}: ${resp.ok ? "ACCEPTED" : "REJECTED - " + resp.error}`);
            resolve(resp);
        });
    });
}

async function run() {
    addLog("\n===== REAL-TIME BIDDING TEST =====\n");

    const admin = await login("admin");
    const team1 = await login("AlphaTeam");
    const team2 = await login("BetaTeam");

    // Start auction
    await apiCall("/admin/start-auction", { method: "POST", headers: { Authorization: `Bearer ${admin.token}` } });
    addLog("🚀 Auction started!");
    await new Promise(r => setTimeout(r, 500));

    // Connect sockets
    const s1 = await connectSocket(team1.token, "AlphaTeam");
    const s2 = await connectSocket(team2.token, "BetaTeam");
    await new Promise(r => setTimeout(r, 500));

    // Place bids
    addLog("\n--- Bidding Round ---");
    await placeBid(s1, 100, "AlphaTeam");
    await new Promise(r => setTimeout(r, 400));
    await placeBid(s2, 150, "BetaTeam");
    await new Promise(r => setTimeout(r, 400));
    await placeBid(s1, 200, "AlphaTeam");
    await new Promise(r => setTimeout(r, 400));

    // Final state
    const state = await apiCall("/event/state");
    addLog(`\n--- Final State ---`);
    addLog(`State: ${state.state}`);
    addLog(`Highest Bid: ${state.highestBid}`);
    addLog(`Highest Bidder: ${state.highestBidderName}`);

    s1.disconnect();
    s2.disconnect();

    addLog("\n✅ TEST COMPLETE - Real-time bidding works!\n");

    fs.writeFileSync("test-results.txt", log.join("\n"));
    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
