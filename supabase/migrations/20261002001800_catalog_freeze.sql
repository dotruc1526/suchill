-- Published chapter membership is immutable; content corrections create a new chapter/version and reuse reward_scope_id.
create trigger immutable_chapter_lessons before insert or update or delete on public.lessons
 for each row execute function private.immutable_child('chapters','chapter_id','status');
create function private.validate_chapter_publish() returns trigger language plpgsql set search_path='' as $$
begin
 if new.status='published' and (
  not exists(select 1 from public.lessons where chapter_id=new.id and status='published')
  or exists(select 1 from public.lessons where chapter_id=new.id and required and status<>'published')) then
  raise exception 'Published chapter requires all required lessons published' using errcode='22023';
 end if;
 return new;
end $$;
create trigger validate_membership before insert or update on public.chapters for each row execute function private.validate_chapter_publish();
revoke all on all functions in schema private from public,anon,authenticated;
