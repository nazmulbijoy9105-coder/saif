-- SAIF — Supabase Schema
-- Creator: Md Nazmul Islam (Bijoy) | NB TECH Bangladesh
-- ILRMF Engine v1.0

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  organisation TEXT DEFAULT '',
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'pro', 'enterprise')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  stripe_customer_id TEXT,
  assessments_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  claimant TEXT NOT NULL,
  defendant TEXT NOT NULL,
  contract_type TEXT DEFAULT 'B2B',
  value TEXT,
  phase INTEGER DEFAULT 1 CHECK (phase BETWEEN 1 AND 4),
  narrative_summary TEXT,
  result JSONB,
  fjr_score INTEGER,
  probability INTEGER,
  hallucination_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_phase ON assessments(phase);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can CRUD their own assessments
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON assessments FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins view all profiles"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins view all assessments"
  ON assessments FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, organisation, tier)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'organisation', ''),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- View: assessment summary
CREATE OR REPLACE VIEW assessment_summary AS
SELECT
  a.id, a.user_id, p.name AS user_name, p.tier,
  a.claimant, a.defendant, a.contract_type,
  a.phase, a.fjr_score, a.probability,
  a.hallucination_count, a.created_at
FROM assessments a
JOIN profiles p ON p.id = a.user_id;

-- Comments
COMMENT ON TABLE assessments IS 'SAIF ILRMF assessments — Md Nazmul Islam (Bijoy) / NB TECH';
COMMENT ON TABLE profiles IS 'SAIF user profiles — ILRMF Engine v1.0';
