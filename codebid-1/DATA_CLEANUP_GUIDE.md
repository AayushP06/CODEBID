# CodeBid Database Cleanup Guide

## Overview
This guide explains how to delete old user data from your CodeBid database.

---

## Method 1: Using Node.js Script (Recommended)

### Quick Cleanup (Delete all user data)
```bash
cd codebid-1/backend
node cleanup-data.js
```

This will:
- ✅ Delete all bids
- ✅ Delete all events
- ✅ Delete all non-admin teams
- ✅ Delete all problems
- ✅ Keep admin team intact

---

## Method 2: Interactive Menu (Full Control)

### Run the interactive cleanup tool
```bash
cd codebid-1/backend
node reset-database.js
```

This gives you options:
1. **Delete all user data** - Clears everything except admin
2. **Delete all teams** - Only removes non-admin teams
3. **Delete all problems** - Only removes problems
4. **Delete all bids** - Only removes bids
5. **Delete all events** - Only removes events
6. **Delete EVERYTHING** - Full database reset (requires confirmation)
7. **Show current data count** - View how much data exists
8. **Exit** - Close the tool

---

## Method 3: Direct SQL (Advanced)

### Using PostgreSQL Client

#### Option A: Delete all user data (keep admin)
```sql
DELETE FROM bids;
DELETE FROM events;
DELETE FROM teams WHERE is_admin = false;
DELETE FROM problems;
```

#### Option B: Delete only teams
```sql
DELETE FROM teams WHERE is_admin = false;
```

#### Option C: Delete only problems
```sql
DELETE FROM problems;
```

#### Option D: Full reset (delete everything)
```sql
DELETE FROM bids;
DELETE FROM events;
DELETE FROM teams;
DELETE FROM problems;
```

#### View current data
```sql
SELECT 'Teams' as table_name, COUNT(*) as count FROM teams
UNION ALL
SELECT 'Problems', COUNT(*) FROM problems
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Bids', COUNT(*) FROM bids;
```

---

## Method 4: Using SQL File

### Run the SQL cleanup script
```bash
cd codebid-1/backend
psql -U postgres -d codebid -f cleanup.sql
```

Then uncomment the SQL commands you want to run in `cleanup.sql`

---

## Database Structure

### Tables and Relationships
```
teams (id, name, coins, score, is_admin)
  ↓
bids (id, event_id, team_id, amount)
  ↓
events (id, state, current_problem_id, highest_bid, highest_bidder_id)
  ↓