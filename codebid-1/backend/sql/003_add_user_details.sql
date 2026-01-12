-- Add user detail columns to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS branch VARCHAR(100);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS year_of_study INTEGER;

-- Add unique constraint on registration number (if not already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'unique_registration_number'
  ) THEN
    ALTER TABLE teams ADD CONSTRAINT unique_registration_number UNIQUE (registration_number);
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_teams_registration_number ON teams(registration_number);
CREATE INDEX IF NOT EXISTS idx_teams_branch ON teams(branch);