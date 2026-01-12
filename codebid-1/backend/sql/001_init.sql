-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    registration_number VARCHAR(100) UNIQUE,
    branch VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    year_of_study INTEGER,
    coins INTEGER DEFAULT 1000,
    score INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'medium',
    test_cases JSONB,
    solution TEXT,
    base_points INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table (for auction rounds)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    state VARCHAR(50) DEFAULT 'WAITING', -- WAITING, AUCTION, CODING, COMPLETED, FINISHED
    current_problem_id INTEGER REFERENCES problems(id),
    highest_bid INTEGER DEFAULT 0,
    highest_bidder_id INTEGER REFERENCES teams(id),
    auction_timer INTEGER DEFAULT 60,
    auction_start_time TIMESTAMP,
    coding_start_time TIMESTAMP,
    coding_end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    team_id INTEGER REFERENCES teams(id),
    amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    team_id INTEGER REFERENCES teams(id),
    problem_id INTEGER REFERENCES problems(id),
    code TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'javascript',
    status VARCHAR(50) DEFAULT 'pending', -- pending, passed, failed
    test_results JSONB,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(name);
CREATE INDEX IF NOT EXISTS idx_bids_event_team ON bids(event_id, team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_event_team ON submissions(event_id, team_id);
CREATE INDEX IF NOT EXISTS idx_events_state ON events(state);