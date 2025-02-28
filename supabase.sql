-- Create the users table
create table public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  license_plate text not null,
  identity_card_number text not null,
  qr_code text not null,
  stages jsonb not null default '{
    "1": {"status": "PENDING"},
    "2": {"status": "PENDING"},
    "3": {"status": "PENDING"}
  }',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create a policy that allows all operations
create policy "Allow all operations for all users" on public.users
  for all
  to public
  using (true)
  with check (true);

-- Enable realtime subscriptions
alter publication supabase_realtime add table public.users; 