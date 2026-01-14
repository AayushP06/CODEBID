-- CodeBid Database Cleanup Script
-- Run this in your PostgreSQL client to clean up data

-- Option 1: Delete all user data (keep tables and admin)
-- DELETE FROM bids;
-- DELETE FROM events;
-- DELETE FROM teams WHERE is_admin = false;
-- DELETE FROM problems;

-- Option 2: Delete only teams (non-admin)
-- DELETE FROM teams WHERE is_admin = false;

-- Option 3: Delete only problems
-- DELETE FROM problems;

-- Option 4: Delete only bids
-- DELETE FROM bids;

-- Option 5: Delete only events
-- DELETE FROM events;

-- Option 6: FULL RESET - Delete everything
-- DELETE FROM bids;
-- DELETE FROM events;
-- DELETE FROM teams;
-- DELETE FROM problems;

-- View current data
SELECT 'Teams' as table_name, COUNT(*) as count FROM teams
UNION ALL
SELECT 'Problems', COUNT(*) FROM problems
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Bids', COUNT(*) FROM bids;

-- View admin teams
SELECT id, name, is_admin, coins, score FROM teams WHERE is_admin = true;

-- View all teams
SELECT id, name, is_admin, coins, score FROM teams ORDER BY created_at DESC;
