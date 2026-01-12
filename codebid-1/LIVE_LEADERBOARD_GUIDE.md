# Live Leaderboard & WebSocket Implementation Guide

## Overview

The CodeBid platform now features a **real-time live leaderboard** that updates during auctions using **WebSocket technology**. This allows all participants to see the top teams and their scores in real-time.

## Architecture

### WebSocket Setup

**Technology**: Socket.io (already integrated)

**Backend**: `codebid-1/backend/src/socket/socket.js`
**Frontend**: `codebid-1/src/socket.js`

### Key Features

✅ **Real-time Updates** - Leaderboard updates instantly when bids are placed  
✅ **Live Bid Tracking** - See highest bidder and bid amount in real-time  
✅ **Top 5 Teams Display** - Shows top performing teams during auction  
✅ **Activity Log** - Real-time activity feed with bid updates  
✅ **Automatic Refresh** - Leaderboard refreshes every 2 seconds during auction  
✅ **Current User Highlight** - Your team is highlighted in the leaderboard  

## Components

### 1. LiveLeaderboard Component
**File**: `codebid-1/src/components/LiveLeaderboard.jsx`

Displays the top 5 teams with:
- Team rank (🥇 🥈 🥉 #4 #5)
- Team name
- Coins remaining
- Current score
- Highlight for current user

**Features**:
- Auto-refreshes every 2 seconds during auction
- Shows medal emojis for top 3
- Highlights current user's team
- Shows "+X more teams" if more than 5 teams

### 2. AuctionView Integration
**File**: `codebid-1/src/views/AuctionView.jsx`

The auction view now displays three panels:
1. **Left Panel** - Problem details and bidding interface
2. **Middle Panel** - Activity log (bid history)
3. **Right Panel** - Live leaderboard (NEW)

Layout: `gridTemplateColumns: "1fr 350px 300px"`

### 3. AuctionContext
**File**: `codebid-1/src/context/AuctionContext.jsx`

State management for:
- `leaderboard` - Array of teams sorted by score
- `LEADERBOARD_UPDATED` action - Updates leaderboard state
- WebSocket listener for `LEADERBOARD_UPDATED` events

### 4. Backend Socket Handler
**File**: `codebid-1/backend/src/socket/socket.js`

**Events**:
- `JOIN_AUCTION` - Client joins auction room
- `PLACE_BID` - Client places a bid
- `BID_UPDATED` - Broadcast to all clients when bid is placed
- `LEADERBOARD_UPDATED` - Broadcast updated leaderboard to all clients

**Flow**:
```
Client places bid
    ↓
Backend validates bid
    ↓
Backend updates database
    ↓
Backend broadcasts BID_UPDATED to all clients
    ↓
Backend broadcasts LEADERBOARD_UPDATED to all clients
    ↓
All clients receive and display updated leaderboard
```

## WebSocket Events

### Client → Server

#### JOIN_AUCTION
```javascript
socket.emit("JOIN_AUCTION");
```
Joins the auction room to receive real-time updates.

#### PLACE_BID
```javascript
socket.emit("PLACE_BID", { amount: 500 }, (response) => {
  if (response.ok) {
    console.log("Bid placed successfully");
  } else {
    console.error("Bid failed:", response.error);
  }
});
```
Places a bid on the current problem.

### Server → Client

#### BID_UPDATED
```javascript
socket.on("BID_UPDATED", (data) => {
  // data = {
  //   amount: 500,
  //   teamId: 1,
  //   teamName: "Team Alpha",
  //   timestamp: "2024-01-12T10:30:00Z"
  // }
});
```
Broadcast when a new bid is placed.

#### LEADERBOARD_UPDATED
```javascript
socket.on("LEADERBOARD_UPDATED", (leaderboard) => {
  // leaderboard = [
  //   { id: 1, name: "Team Alpha", coins: 500, score: 100 },
  //   { id: 2, name: "Team Beta", coins: 300, score: 80 },
  //   ...
  // ]
});
```
Broadcast when leaderboard changes.

#### STATE_CHANGED
```javascript
socket.on("STATE_CHANGED", (eventState) => {
  // Broadcast when auction state changes
});
```

## Data Flow

### During Auction

```
┌─────────────────────────────────────────────────────────┐
│                    AUCTION PHASE                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Team A places bid → Backend validates → Updates DB    │
│                                                         │
│  Backend broadcasts:                                    │
│  1. BID_UPDATED (to activity log)                      │
│  2. LEADERBOARD_UPDATED (to leaderboard)               │
│                                                         │
│  All clients receive updates instantly                 │
│  Leaderboard refreshes every 2 seconds                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Leaderboard Calculation

The leaderboard is calculated based on:
1. **Score** - Points earned from solving problems
2. **Coins** - Remaining coins (secondary sort)

**Query**: `Team.getLeaderboard()`
- Returns top 10 teams
- Sorted by score DESC, then coins DESC
- Excludes admin team

## Real-time Updates

### Automatic Refresh
- Leaderboard refreshes every 2 seconds during auction
- Uses API endpoint: `GET /admin/leaderboard`
- Falls back to polling if WebSocket unavailable

### WebSocket Broadcast
- Instant updates when bids are placed
- All connected clients receive updates simultaneously
- No polling delay

## Display Features

### Top Teams Display
```
🥇 Team Alpha
   500 coins | Score: 100

🥈 Team Beta
   300 coins | Score: 80

🥉 Team Gamma
   200 coins | Score: 60

#4 Team Delta
   150 coins | Score: 50

#5 Team Epsilon
   100 coins | Score: 40

+5 more teams
```

### Current User Highlight
- Your team is highlighted with cyan border
- Shows "YOU" badge next to team name
- Stands out from other teams

### Medal Emojis
- 🥇 Gold for 1st place
- 🥈 Silver for 2nd place
- 🥉 Bronze for 3rd place
- #4, #5 for 4th and 5th place

## API Endpoints

### GET /admin/leaderboard
Returns top 10 teams sorted by score.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Team Alpha",
    "coins": 500,
    "score": 100,
    "is_admin": false
  },
  {
    "id": 2,
    "name": "Team Beta",
    "coins": 300,
    "score": 80,
    "is_admin": false
  }
]
```

## Performance Considerations

### Optimization
- Only top 5 teams displayed (reduces rendering)
- Leaderboard updates every 2 seconds (not every bid)
- WebSocket broadcasts are efficient
- Database queries are indexed

### Scalability
- Supports hundreds of concurrent users
- WebSocket connections are lightweight
- Leaderboard calculation is O(n log n)
- Can handle high-frequency bidding

## Troubleshooting

### Leaderboard Not Updating
1. Check WebSocket connection: `socket.connected`
2. Verify backend is running: `npm run dev`
3. Check browser console for errors
4. Verify CORS settings in backend

### Bids Not Appearing
1. Check bid validation in backend
2. Verify team has sufficient coins
3. Check bid amount > current highest bid
4. Look for error messages in console

### WebSocket Connection Failed
1. Verify frontend URL matches `VITE_WS_BASE`
2. Check backend CORS origin
3. Verify Socket.io is installed
4. Check firewall/proxy settings

## Testing

### Manual Testing
1. Open auction in multiple browser tabs
2. Place bid in one tab
3. Verify leaderboard updates in all tabs
4. Check activity log for bid messages

### Load Testing
```bash
# Simulate multiple concurrent users
npm run test:load
```

## Future Enhancements

- [ ] Real-time score updates
- [ ] Team statistics dashboard
- [ ] Historical leaderboard tracking
- [ ] Leaderboard animations
- [ ] Sound notifications for bid updates
- [ ] Mobile-optimized leaderboard
- [ ] Export leaderboard data
- [ ] Leaderboard filters (by branch, year, etc.)

## Files Modified

- `codebid-1/src/components/LiveLeaderboard.jsx` - NEW
- `codebid-1/src/views/AuctionView.jsx` - Updated layout
- `codebid-1/src/context/AuctionContext.jsx` - Added leaderboard state
- `codebid-1/backend/src/socket/socket.js` - Added leaderboard broadcast

## References

- [Socket.io Documentation](https://socket.io/docs/)
- [WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
- [Real-time Applications](https://en.wikipedia.org/wiki/Real-time_web)
