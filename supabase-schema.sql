-- Enable Row Level Security (RLS)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends the auth.users table)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE,
  
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Pairs table (to link two users together)
CREATE TABLE IF NOT EXISTS pairs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user1_id, user2_id)
);

-- Enable Row Level Security
ALTER TABLE pairs ENABLE ROW LEVEL SECURITY;

-- Create policy for pairs
CREATE POLICY "Users can view their own pairs" ON pairs
  FOR SELECT USING (auth.uid() IN (user1_id, user2_id));

-- Letters table (for messages between users)
CREATE TABLE IF NOT EXISTS letters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  is_draft BOOLEAN DEFAULT TRUE,
  is_shared BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  shared_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  reading_mode TEXT DEFAULT 'manual', -- 'timed', 'manual', 'weekly', 'silent'
  unlock_at TIMESTAMP WITH TIME ZONE, -- For timed mode
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- Create policies for letters
CREATE POLICY "Authors can view and edit their own letters" ON letters
  FOR ALL USING (auth.uid() = author_id);
  
CREATE POLICY "Recipients can view shared letters" ON letters
  FOR SELECT USING (auth.uid() = recipient_id AND is_shared = TRUE);
