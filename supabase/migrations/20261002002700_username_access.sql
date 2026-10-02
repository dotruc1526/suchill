-- Username identities are private mappings; Supabase remains the password authority.
begin;
create table public.login_names (
  username text primary key check (username ~ '^[a-z0-9_]{3,32}$'),
  user_id uuid not null unique references auth.users(id) on delete cascade
);
create table public.login_limits (
  bucket text primary key, window_started timestamptz not null, attempts integer not null
);
create table public.recovery_email_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null check (length(email) <= 254),
  token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at timestamptz not null,
  processing boolean not null default false
);
alter table public.login_names enable row level security;
alter table public.login_limits enable row level security;
alter table public.recovery_email_requests enable row level security;
revoke all on public.login_names, public.login_limits, public.recovery_email_requests from public, anon, authenticated;
grant all on public.login_names, public.login_limits, public.recovery_email_requests to service_role;

create function public.guard_recovery_reservation() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.processing and (new.token_hash <> old.token_hash or new.email <> old.email
    or new.expires_at <> old.expires_at) then
    raise exception 'Recovery confirmation in progress' using errcode = 'PT409';
  end if;
  return new;
end $$;
revoke all on function public.guard_recovery_reservation() from public, anon, authenticated;
create trigger guard_recovery_reservation before update on public.recovery_email_requests
for each row execute function public.guard_recovery_reservation();

create function public.enroll_username_identity() returns trigger
language plpgsql security definer set search_path = '' as $$
declare name text := new.raw_app_meta_data->>'suchill_username';
begin
  if new.email like '%@accounts.suchill.invalid' then
    if name is null or name !~ '^[a-z0-9_]{3,32}$'
      or new.email <> name || '@accounts.suchill.invalid' then
      raise exception 'Internal identities require trusted enrollment' using errcode = '42501';
    end if;
    insert into public.login_names(username, user_id) values (name, new.id);
  elsif name is not null then
    raise exception 'Username signup requires its internal identity' using errcode = '42501';
  end if;
  return new;
end $$;
revoke all on function public.enroll_username_identity() from public, anon, authenticated;
create trigger enroll_username_identity after insert on auth.users
for each row execute function public.enroll_username_identity();

create function public.username_identity(p_username text) returns text
language sql security definer stable set search_path = '' as $$
  select u.email from public.login_names n join auth.users u on u.id = n.user_id
  where n.username = p_username;
$$;
create function public.claim_login_name(p_username text, p_user_id uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare existing text;
begin
  if p_username !~ '^[a-z0-9_]{3,32}$' then
    raise exception 'Invalid username' using errcode = '22023';
  end if;
  select username into existing from public.login_names where user_id = p_user_id;
  if existing is not null then
    if existing <> p_username then
      raise exception 'Username is immutable' using errcode = 'PT409';
    end if;
    return existing;
  end if;
  insert into public.login_names(username, user_id) values (p_username, p_user_id);
  return p_username;
exception when unique_violation then
  raise exception 'Username unavailable' using errcode = 'PT409';
end $$;
create function public.take_login_quota(p_bucket text, p_max integer, p_seconds integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare used integer;
begin
  if p_bucket !~ '^[a-z0-9:_-]{1,160}$' or p_max < 1 or p_max > 500 or p_seconds not between 1 and 3600 then
    raise exception 'Invalid quota' using errcode = '22023';
  end if;
  insert into public.login_limits(bucket, window_started, attempts) values (p_bucket, now(), 1)
  on conflict (bucket) do update set
    attempts = case when public.login_limits.window_started <= now() - make_interval(secs => p_seconds)
      then 1 else public.login_limits.attempts + 1 end,
    window_started = case when public.login_limits.window_started <= now() - make_interval(secs => p_seconds)
      then now() else public.login_limits.window_started end
  returning attempts into used;
  -- Bounded retention; identity buckets contain only salted hashes.
  delete from public.login_limits where window_started < now() - interval '2 hours';
  return used <= p_max;
end $$;
create function public.consume_recovery_email(p_user_id uuid, p_token_hash text) returns text
language sql security definer set search_path = '' as $$
  update public.recovery_email_requests set processing = true
  where user_id = p_user_id and token_hash = p_token_hash and expires_at > now() and not processing
  returning email;
$$;
create function public.finish_recovery_email(p_user_id uuid, p_token_hash text, p_success boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_success then
    delete from public.recovery_email_requests
    where user_id = p_user_id and token_hash = p_token_hash and processing;
  else
    update public.recovery_email_requests set processing = false
    where user_id = p_user_id and token_hash = p_token_hash and processing;
  end if;
end $$;
revoke all on function public.username_identity(text), public.claim_login_name(text, uuid),
  public.take_login_quota(text, integer, integer), public.consume_recovery_email(uuid, text),
  public.finish_recovery_email(uuid, text, boolean) from public, anon, authenticated;
grant execute on function public.username_identity(text), public.claim_login_name(text, uuid),
  public.take_login_quota(text, integer, integer), public.consume_recovery_email(uuid, text),
  public.finish_recovery_email(uuid, text, boolean) to service_role;
notify pgrst, 'reload schema';
commit;
