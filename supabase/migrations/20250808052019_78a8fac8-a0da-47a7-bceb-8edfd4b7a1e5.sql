-- Ensure helper function exists
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

alter table public.bookings enable row level security;

-- Recreate policies idempotently
do $$ begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='bookings' and policyname='Anyone can create bookings') then
    execute 'drop policy "Anyone can create bookings" on public.bookings';
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='bookings' and policyname='Authenticated users can view bookings') then
    execute 'drop policy "Authenticated users can view bookings" on public.bookings';
  end if;
end $$;

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

-- Trigger for updated_at (drop then create)
drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row
execute function public.update_updated_at_column();

create index if not exists idx_bookings_event_date on public.bookings(event_date);

-- CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null
);

alter table public.contact_messages enable row level security;

-- Recreate policies idempotently
do $$ begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='contact_messages' and policyname='Anyone can create contact messages') then
    execute 'drop policy "Anyone can create contact messages" on public.contact_messages';
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='contact_messages' and policyname='Authenticated users can view contact messages') then
    execute 'drop policy "Authenticated users can view contact messages" on public.contact_messages';
  end if;
end $$;

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

-- Trigger for updated_at (drop then create)
drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row
execute function public.update_updated_at_column();