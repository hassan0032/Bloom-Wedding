-- Set the provided user as admin and all others as customer in user_roles
insert into public.user_roles (user_id, role)
values ('764b5401-eb4b-4101-a909-e581e95ec29e', 'admin')
on conflict (user_id) do update set role = 'admin';

insert into public.user_roles (user_id, role)
select id, 'customer' from auth.users
where id != '764b5401-eb4b-4101-a909-e581e95ec29e'
  and id not in (select user_id from public.user_roles);
