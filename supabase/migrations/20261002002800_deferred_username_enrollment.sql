-- GoTrue inserts auth.users before applying admin app_metadata in the same transaction.
-- Inspect the final persisted row at commit; public user metadata still cannot enroll.
begin;
create or replace function public.enroll_username_identity() returns trigger
language plpgsql security definer set search_path = '' as $$
declare identity_email text; identity_name text;
begin
  select email, raw_app_meta_data->>'suchill_username' into identity_email, identity_name
  from auth.users where id = new.id;
  if identity_email like '%@accounts.suchill.invalid' then
    if identity_name is null or identity_name !~ '^[a-z0-9_]{3,32}$'
      or identity_email <> identity_name || '@accounts.suchill.invalid' then
      raise exception 'Internal identities require trusted enrollment' using errcode = '42501';
    end if;
    insert into public.login_names(username, user_id) values (identity_name, new.id);
  elsif identity_name is not null then
    raise exception 'Username signup requires its internal identity' using errcode = '42501';
  end if;
  return new;
end $$;
drop trigger enroll_username_identity on auth.users;
create constraint trigger enroll_username_identity after insert on auth.users
deferrable initially deferred for each row execute function public.enroll_username_identity();
notify pgrst, 'reload schema';
commit;
