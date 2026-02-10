-- Add tone column to roasts table
-- This allows storing the user's roast intensity preference (mild/medium/spicy)

ALTER TABLE roasts 
ADD COLUMN IF NOT EXISTS tone TEXT CHECK (tone IN ('mild', 'medium', 'spicy')) DEFAULT 'medium';

-- Add comment for documentation
COMMENT ON COLUMN roasts.tone IS 'User-selected roast intensity: mild (polite), medium (direct), or spicy (savage)';
