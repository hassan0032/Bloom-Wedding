-- insert into user_roles (user_id, role) values ('123e4567-e89b-12d3-a456-426614174000', 'admin');

-- Optional: Set all other users as customers (if needed)
-- insert into user_roles (user_id, role)
-- select id, 'customer' from auth.users where id != '<ADMIN_USER_ID>' and id not in (select user_id from user_roles);
