-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  plan text default 'free', -- 'free', 'pro', 'agency'
  credits integer default 3,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for roasts
create table roasts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users, -- can be null for anonymous roasts (if allowed) or linked to user
  url text not null,
  score integer not null,
  roast_text jsonb, -- Store the JSON structure of the roast
  ux_audit jsonb,
  seo_audit jsonb,
  copy_audit jsonb,
  conversion_tips jsonb,
  performance_audit jsonb,
  is_public boolean default true,
  paid boolean default false
);

-- RLS for roasts
alter table roasts enable row level security;

create policy "Public roasts are viewable by everyone." on roasts
  for select using (is_public = true);

create policy "Users can view their own roasts." on roasts
  for select using (auth.uid() = user_id);

create policy "Users can insert their own roasts." on roasts
  for insert with check (auth.uid() = user_id or user_id is null);

-- Function to decrement credits
create or replace function decrement_credits(user_id_input uuid)
returns void as $$
begin
  update profiles
  set credits = credits - 1
  where id = user_id_input and credits > 0;
end;
$$ language plpgsql security definer;
