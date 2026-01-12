import React, { useState, useEffect } from "react";
import { useAuction } from "../context/AuctionContext";
import LiveLeaderboard from "../components/LiveLeaderboard";

const AuctionView = () => {
  const { state, placeBid } = useAuction();
  const { auction, user, messages } = state;
  const { currentProblem, highestBid, highestTeamId, timeLeft } = auction;

  const [bidAmount, setBidAmount] = useState("");
  const [uiTimeLeft, setUiTimeLeft] = useState(timeLeft ?? null);

  // Require login
  if (!user) {
    return (
      <div className="flex-center" style={{ height: "100vh" }}>
        Please login...
      </div>
    );
  }

  // Sync UI timer when backend updates timeLeft (endsIn)
  useEffect(() => {
    setUiTimeLeft(timeLeft ?? null);
  }, [timeLeft]);

  // Local countdown display (backend still source of truth)
  useEffect(() => {
    if (uiTimeLeft == null) return;
    if (uiTimeLeft <= 0) return;

    const t = setInterval(() => {
      setUiTimeLeft((x) => (x > 0 ? x - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [uiTimeLeft]);

  const handleBid = (e) => {
    e.preventDefault();
    if (!bidAmount) return;

    placeBid(parseInt(bidAmount, 10));
    setBidAmount("");
  };

  // Scroll to bottom of messages
  useEffect(() => {
    const msgContainer = document.getElementById("message-log");
    if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
  }, [messages]);

  // If auction completed
  if (state.appStatus === "COMPLETED") {
    return (
      <div
        className="container flex-center"
        style={{ flexDirection: "column", height: "100vh", textAlign: "center" }}
      >
        <h1 className="text-gradient" style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          AUCTION COMPLETED
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "1.2rem", marginBottom: "2rem" }}>
          All problems have been auctioned.
          <br />
          Prepare for the Coding Phase.
        </p>
      </div>
    );
  }

  if (!currentProblem) {
    return <div className="flex-center" style={{ height: "100vh" }}>Loading Problem...</div>;
  }

  const isWinning = highestTeamId && user?.id === highestTeamId;

  return (
    <div
      className="container"
      style={{
        padding: "2rem 1rem",
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: "2rem",
      }}
    >
      {/* Header */}
      <header className="flex-center" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "20px", height: "20px", background: "var(--color-primary)", borderRadius: "50%" }} />
          <span style={{ fontWeight: 700, letterSpacing: "0.1em" }}>CODEBID</span>
        </div>

        <div
          className="glass-panel"
          style={{ padding: "0.5rem 1.5rem", display: "flex", gap: "1rem", borderRadius: "var(--radius-full)" }}
        >
          <span>
            Wallet: <strong style={{ color: "var(--color-success)" }}>{user.wallet}</strong>
          </span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>Problem ID: {currentProblem.id}</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px 300px", gap: "2rem", alignItems: "start" }}>
        {/* Left: Problem Card */}
        <div className="glass-panel" style={{ padding: "3rem", position: "relative", overflow: "hidden" }}>
          {/* Timer Badge */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: uiTimeLeft != null && uiTimeLeft < 10 ? "var(--color-primary)" : "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-full)",
              fontWeight: "bold",
            }}
            className={uiTimeLeft != null && uiTimeLeft < 10 ? "animate-pulse-glow" : ""}
          >
            {uiTimeLeft == null ? "--" : `${uiTimeLeft}s`}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "0.8rem",
                border: "1px solid rgba(255,255,255,0.1)",
                color: currentProblem.difficulty === "Hard" ? "var(--color-primary)" : "var(--color-success)",
              }}
            >
              {String(currentProblem.difficulty).toUpperCase()}
            </span>
          </div>

          <h2 className="text-hero" style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: 1.1 }}>
            {currentProblem.title}
          </h2>

          <p style={{ color: "var(--color-text-muted)", fontSize: "1.2rem" }}>
            Base Points:{" "}
            <span style={{ color: "white" }}>
              {currentProblem.basePoints ?? currentProblem.points ?? 0}
            </span>
          </p>

          <hr style={{ borderColor: "var(--color-border)", margin: "2rem 0" }} />

          {/* Current Bid Display */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center", marginBottom: "3rem" }}>
            <div style={{ letterSpacing: "0.2em", fontSize: "0.8rem", opacity: 0.7 }}>CURRENT HIGHEST BID</div>

            <div
              style={{
                fontSize: "5rem",
                lineHeight: 1,
                fontWeight: "800",
                color: highestBid > 0 ? "var(--color-primary)" : "rgba(255,255,255,0.2)",
              }}
            >
              {highestBid || 0}
            </div>

            {/* Show highest bidder team name */}
            {highestBid > 0 && (
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  HIGHEST BIDDER
                </div>
                <div
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: isWinning ? "rgba(0, 255, 157, 0.1)" : "rgba(255, 77, 77, 0.1)",
                    border: `2px solid ${isWinning ? "var(--color-success)" : "var(--color-primary)"}`,
                    color: isWinning ? "var(--color-success)" : "var(--color-primary)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    letterSpacing: "0.1em"
                  }}
                >
                  {isWinning ? `🏆 YOU (${user.name})` : `👑 ${auction.highestBidderName || 'UNKNOWN TEAM'}`}
                </div>
                
                {isWinning && (
                  <div style={{ 
                    marginTop: "0.5rem", 
                    fontSize: "0.9rem", 
                    color: "var(--color-success)",
                    fontWeight: "bold"
                  }}>
                    You are currently winning this problem!
                  </div>
                )}
                
                {!isWinning && highestBid > 0 && (
                  <div style={{ 
                    marginTop: "0.5rem", 
                    fontSize: "0.9rem", 
                    color: "var(--color-text-muted)"
                  }}>
                    Place a bid higher than {highestBid} to take the lead
                  </div>
                )}
              </div>
            )}

            {highestBid === 0 && (
              <div style={{ 
                marginTop: "1rem",
                padding: "1rem 2rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px dashed var(--color-border)",
                borderRadius: "var(--radius-sm)",
                textAlign: "center",
                color: "var(--color-text-muted)"
              }}>
                <div style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>🎯 No bids yet!</div>
                <div style={{ fontSize: "0.9rem" }}>Be the first to bid on this problem</div>
              </div>
            )}
          </div>

          {/* Bidding Controls */}
          <form onSubmit={handleBid} style={{ display: "flex", gap: "1rem", maxWidth: "400px", margin: "0 auto" }}>
            <input
              type="number"
              placeholder="BID AMOUNT"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={highestBid + 1}
              max={user.wallet}
              style={{
                flex: 1,
                fontSize: "1.5rem",
                textAlign: "center",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              }}
              autoFocus
            />
            <button type="submit" className="hero-btn" style={{ padding: "0 3rem" }}>
              BID
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
            <div style={{ color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
              MINIMUM BID: <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>{highestBid + 1}</span> coins
            </div>
            <div style={{ color: "var(--color-text-muted)" }}>
              YOUR WALLET: <span style={{ color: "var(--color-success)", fontWeight: "bold" }}>{user.wallet}</span> coins
            </div>
            {parseInt(bidAmount) > user.wallet && (
              <div style={{ color: "var(--color-primary)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                ⚠️ Insufficient coins! You only have {user.wallet} coins.
              </div>
            )}
            {parseInt(bidAmount) <= highestBid && parseInt(bidAmount) > 0 && (
              <div style={{ color: "var(--color-primary)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                ⚠️ Bid must be higher than {highestBid} coins.
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Feed */}
        <div className="glass-panel" style={{ height: "600px", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "1rem", borderBottom: "1px solid var(--color-border)", fontWeight: "bold", letterSpacing: "0.1em" }}>
            ACTIVITY LOG
          </div>

          <div id="message-log" style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  fontSize: "0.9rem",
                  color:
                    msg.type === "alert"
                      ? "var(--color-primary)"
                      : msg.type === "success"
                      ? "var(--color-success)"
                      : "var(--color-text-muted)",
                  borderLeft: `2px solid ${msg.type === "alert" ? "var(--color-primary)" : "rgba(255,255,255,0.1)"}`,
                  paddingLeft: "10px",
                }}
              >
                <div style={{ fontSize: "0.7rem", opacity: 0.5, marginBottom: "2px" }}>
                  {new Date(msg.id).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </div>
                {msg.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Leaderboard */}
        <LiveLeaderboard />
      </div>
    </div>
  );
};

export default AuctionView;
