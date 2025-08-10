-- Drop all existing policies from bookings table
do $$ 
declare
  policy_record record;
begin
  -- Drop all policies on bookings table
  for policy_record in 
    select policyname 
    from pg_policies 
    where schemaname = 'public' 
    and tablename = 'bookings'
  loop
    execute format('drop policy if exists "%s" on public.bookings', policy_record.policyname);
  end loop;
end $$;

-- Create new policies for bookings table
-- Policy 1: Anyone can make a booking (insert)
create policy "Anyone can make bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

-- Policy 2: Only authenticated users can view bookings (select)
create policy "Authenticated users can view bookings"
  on public.bookings
  for select
  to authenticated
  using (true); 