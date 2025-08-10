-- Create a user_roles table to store roles for each user
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

-- Insert your admin user (replace with your real admin's UUID)
-- insert into public.user_roles (user_id, role) values ('<ADMIN_USER_ID>', 'admin');

-- By default, new users are customers. You can set this in your signup logic or with a trigger.
