# Piston API Integration Flow

## Current Implementation ✅

The Piston API code editor is **correctly implemented** to be available **ONLY after the bidding phase ends**.

---

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CODEBID FLOW                             │
└─────────────────────────────────────────────────────────────┘

PHASE 1: AUCTION (BIDDING)
┌─────────────────────────────────────────────────────────────┐
│ ✅ Participants can:                                        │
│   ├─ View problem statement                                 │
│   ├─ See problem difficulty                                 │
│   ├─ See base points                                        │
│   ├─ Place bids                                             │
│   ├─ See live leaderboard                                   │
│   └─ See activity log                                       │
│                                                             │
│ ❌ Participants CANNOT:                                     │
│   ├─ Write code                                             │
│   ├─ Run code                                               │
│   ├─ Use Piston API                                         │
│   ├─ Submit solutions                                       │
│   └─ Access code editor                                     │
│                                                             │
│ View: AuctionView.jsx                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    AUCTION ENDS
                            ↓
PHASE 2: CODING (AFTER BIDDING)
┌─────────────────────────────────────────────────────────────┐
│ ✅ Participants can:                                        │
│   ├─ View purchased problems                                │
│   ├─ Open code editor                                       │
│   ├─ Write code in multiple languages                       │
│   ├─ Run code against test cases (Piston API)              │
│   ├─ See test results                                       │
│   ├─ Submit solutions                                       │
│   └─ See live leaderboard                                   │
│                                                             │
│ View: CodingView.jsx                                        │
│ Component: CodeEditor.jsx                                   │
│ Service: CodeExecutor.js (uses Piston API)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    CODING ENDS
                            ↓
PHASE 3: FINISHED
┌─────────────────────────────────────────────────────────────┐
│ ✅ Participants can:                                        │
│   ├─ View final leaderboard                                 │
│   ├─ See final scores                                       │
│   ├─ See ranking                                            │
│   └─ Review solutions                                       │
│                                                             │
│ View: LeaderboardView.jsx                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
Frontend Views:
├── AuctionView.jsx          ← Bidding phase (NO code editor)
├── CodingView.jsx           ← Coding phase (WITH code editor)
└── LeaderboardView.jsx      ← Results phase

Frontend Components:
├── CodeEditor.jsx           ← Monaco editor + Piston API
└── LiveLeaderboard.jsx      ← Real-time leaderboard

Backend Services:
├── codeExecutor.js          ← Piston API integration
├── socket/socket.js         ← WebSocket for real-time updates
└── routes/code.routes.js    ← Code execution endpoints
```

---

## Piston API Usage

### When is Piston API Used?

✅ **CODING PHASE ONLY**

```javascript
// File: codebid-1/src/components/CodeEditor.jsx

const handleRunCode = async () => {
  // This is called when user clicks "Run Code" button
  // Only available during CODING phase
  
  const response = await fetch('/api/code/run', {
    method: 'POST',
    body: JSON.stringify({
      code,
      language,
      problemId: problem?.id,
      testCases: problem?.testCases
    })
  });
  
  // Backend calls Piston API
  // Returns test results
};
```

### Backend Piston API Call

```javascript
// File: codebid-1/backend/src/services/codeExecutor.js

static async executePiston(code, language, stdin = "") {
  const response = await fetch("https://api.piston.rocks/execute", {
    method: "POST",
    body: JSON.stringify({
      language: language,
      version: "*",
      files: [{ name: "solution.js", content: code }],
      stdin: stdin,
      compile_timeout: 10000,
      run_timeout: 5000
    })
  });
  
  return response.json();
}
```

---

## Supported Languages

During CODING phase, participants can write code in:

- ✅ JavaScript
- ✅ Python
- ✅ Java
- ✅ C++
- ✅ C#
- ✅ Go
- ✅ Rust
- ✅ PHP

---

## Test Case Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│              TEST CASE EXECUTION FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. User writes code in CodeEditor
   ↓
2. User clicks "Run Code"
   ↓
3. Frontend sends code to backend
   POST /api/code/run
   {
     code: "...",
     language: "python",
     testCases: [
       { input: "5\n3", output: "8" },
       { input: "10\n20", output: "30" }
     ]
   }
   ↓
4. Backend receives request
   ├─ Validates code
   ├─ Validates language
   └─ Validates test cases
   ↓
5. For each test case:
   ├─ Call Piston API
   ├─ Execute code with input
   ├─ Get output
   ├─ Compare with expected output
   └─ Record pass/fail
   ↓
6. Backend returns results
   {
     output: "Test Results: 2/2 passed",
     testResults: {
       passed: 2,
       total: 2,
       details: [
         { testNumber: 1, passed: true, ... },
         { testNumber: 2, passed: true, ... }
       ]
     }
   }
   ↓
7. Frontend displays results
   ├─ Show output
   ├─ Show test results
   ├─ Show pass/fail for each test
   └─ Enable "Submit Solution" button
   ↓
8. User clicks "Submit Solution"
   ↓
9. Backend evaluates and saves submission
   ├─ Calculates score
   ├─ Updates leaderboard
   ├─ Broadcasts to all clients
   └─ Returns success
   ↓
10. Frontend shows success message
```

---

## Current Status

✅ **Piston API Integration**: Complete
✅ **Code Editor**: Implemented
✅ **Test Case Execution**: Working
✅ **Real-time Leaderboard**: Working
✅ **WebSocket Updates**: Working
✅ **Phase Separation**: Correct (Auction → Coding → Finished)

---

## What Happens During Each Phase

### AUCTION PHASE (Bidding)
- **Duration**: Admin sets timer (default 60 seconds)
- **Activity**: Teams place bids
- **View**: AuctionView.jsx
- **Piston API**: ❌ NOT AVAILABLE
- **Code Editor**: ❌ NOT AVAILABLE

### CODING PHASE (After Auction)
- **Duration**: Admin sets timer (default 5 minutes)
- **Activity**: Teams write and submit code
- **View**: CodingView.jsx
- **Piston API**: ✅ AVAILABLE
- **Code Editor**: ✅ AVAILABLE
- **Features**:
  - Write code in 8 languages
  - Run code against test cases
  - See real-time results
  - Submit solutions
  - See live leaderboard

### FINISHED PHASE
- **Activity**: View results
- **View**: LeaderboardView.jsx
- **Piston API**: ❌ NOT AVAILABLE
- **Code Editor**: ❌ NOT AVAILABLE

---

## Admin Controls

Admin can:

1. **Start Auction**
   - Selects a problem
   - Sets timer (default 60s)
   - Participants start bidding

2. **Start Coding**
   - Auction ends
   - Coding phase begins
   - Participants can use Piston API

3. **End Event**
   - Coding phase ends
   - Results are finalized
   - Leaderboard is displayed

---

## Verification

To verify Piston API is working correctly:

1. **During Auction Phase**
   - ✅ Code editor should NOT be visible
   - ✅ Only bidding interface should show

2. **During Coding Phase**
   - ✅ Code editor should be visible
   - ✅ "Run Code" button should work
   - ✅ Test results should display
   - ✅ "Submit Solution" button should work

3. **During Finished Phase**
   - ✅ Leaderboard should display
   - ✅ Code editor should NOT be visible

---

## Summary

✅ **Piston API is correctly implemented**
✅ **Code editor is only available during CODING phase**
✅ **Participants cannot use Piston API during AUCTION phase**
✅ **All features are working as designed**

No changes needed! The implementation is correct. 🎉
