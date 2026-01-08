# How to Verify CodeBid (Role Separation)

Follow these steps to test the full flow of the application with separate Admin and Student roles.

## 1. Start the Application
Open your terminal in the `codebid-1` directory and run:
```bash
npm run dev
```
Open the provided URL (usually `http://localhost:5173`) in your browser.

## 2. Setup the "Dual View"
Since this is a real-time app, you need to simulate two people.
1.  **Tab 1 (Admin)**: Open the app. Select **ADMIN**.
2.  **Tab 2 (Student)**: Open the app in a **New Window** or **Incognito Mode**. Select **STUDENT**.

---

## 3. The Verification Flow

### Step A: Login & Waiting
1.  **Student**: Enter a Team Name (e.g., "Team Alpha") and click **JOIN AUCTION**.
    *   *Result*: You should see "WAITING FOR HOST...".
2.  **Admin**: You should see the **Admin Dashboard** with status `WAITING`.

### Step B: The Auction
1.  **Admin**: Click **START EVENT (AUCTION)**.
2.  **Student**: The screen should automatically change to the **Auction View**.
    *   *Action*: Try bidding on the current problem.
    *   *Verify*: The "Highest Bid" updates. Your Wallet decreases.
3.  **Admin**: Monitor the status. Wait for problems to finish (or the timer to run out).

### Step C: Transition to Coding
1.  **Admin**: Once all problems are sold, the status becomes `COMPLETED`.
    *   Click **START CODING PHASE**.
2.  **Student**: The screen automatically changes to the **Coding Dashboard**.
    *   *Verify*: You see the timer ticking down. You see the problems you bought.

### Step D: Coding & Submission
1.  **Student**: Click **OPEN EDITOR** on a problem.
    *   Type some code.
    *   Click **Run Code** (Mock test).
    *   Click **Submit**.
    *   *Verify*: Score increases in the dashboard header.

### Step E: The End
1.  **Admin**: Click **END EVENT** (red button).
2.  **Student**: The screen matches to the **Leaderboard**.
    *   *Verify*: Your team is listed with your final score.

---

## Troubleshooting
- If the views don't update, ensure both tabs are connected to the same local server.
- Refersh the page if it gets stuck (state is saved in memory, so a refresh might reset the state to initial).
- **Proto Folder**: Remember, `codebid/proto` contains the *old* single-page version. Make sure you are running `codebid-1`.
