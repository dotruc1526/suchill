-- Trusted backend/editor connections have explicit privileges; browser roles remain read/RPC only.
grant usage on schema private to service_role;
grant all on all tables in schema public,private to service_role;
grant usage on all sequences in schema public,private to service_role;
create or replace function private.ledger_append_only() returns trigger language plpgsql set search_path='' as $$
begin
 -- Authorized auth deletion cascades personal records. An ordinary ledger DELETE still fails.
 if tg_op='DELETE' and not exists(select 1 from auth.users where id=old.user_id) then return old; end if;
 raise exception 'Ledger is append only' using errcode='42501';
end $$;
create function private.audit_account_deletion() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into private.audit_events(user_id,kind,payload) values(old.id,'account_deleted','{}');
 return old;
end $$;
create trigger audit_delete before delete on auth.users for each row execute function private.audit_account_deletion();
revoke all on all functions in schema private from public,anon,authenticated;
