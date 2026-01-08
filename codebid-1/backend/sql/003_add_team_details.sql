-- Add additional columns to teams table for detailed signup
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS branch VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS year_of_study INTEGER;

-- Add index for registration number lookups
CREATE INDEX IF NOT EXISTS idx_teams_registration_number ON teams(registration_number);