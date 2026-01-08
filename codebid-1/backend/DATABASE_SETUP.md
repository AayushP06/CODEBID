# Database Setup Instructions

## Option 1: Using Docker (Recommended)

1. **Start Docker Desktop** (if not already running)

2. **Start PostgreSQL container:**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

## Option 2: Local PostgreSQL Installation

1. **Install PostgreSQL** on your system
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Use default settings: username `postgres`, port `5432`

2. **Create database:**
   ```sql
   CREATE DATABASE codebid;
   ```

3. **Update .env file** if needed (current settings should work with defaults)

4. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

## Verify Database Setup

After setup, you can verify the database is working:

```bash
# Test database connection
npm run db:migrate

# Start the backend server
npm run dev
```

## Database Schema

The database includes these tables:
- `teams` - Team information and coin balances
- `problems` - Coding problems for auctions
- `events` - Auction/coding event states
- `bids` - Bid history
- `submissions` - Code submissions

## Sample Data

The migration includes:
- Admin team with 10,000 coins
- 3 sample coding problems (Two Sum, Reverse String, Valid Parentheses)
- Initial event in WAITING state

## Troubleshooting

- **Docker not running**: Start Docker Desktop first
- **Connection refused**: Check if PostgreSQL is running on port 5432
- **Permission denied**: Make sure PostgreSQL user has proper permissions
- **Database doesn't exist**: Create the `codebid` database manually first