-- Create utility function for updated_at timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- BOOKINGS TABLE
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  event_date date not null,
  event_type text,
  guests integer,
  message text
);

-- Enable RLS
alter table public.bookings enable row level security;

-- Policies
create policy "Anyone can create bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can view bookings"
  on public.bookings
  for select
  to authenticated
  using (true);

-- Trigger for updated_at
create trigger set_bookings_updated_at
before update on public.bookings
for each row
execute function public.update_updated_at_column();

-- Helpful index
create index idx_bookings_event_date on public.bookings(event_date);

-- CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Policies
create policy "Anyone can create contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can view contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

-- Trigger for updated_at
create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row
execute function public.update_updated_at_column();