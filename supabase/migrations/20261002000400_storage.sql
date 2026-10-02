-- These metadata inserts create buckets; uploads/moves/deletes use the Storage API.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('published-media','published-media',false,26214400,array['image/png','image/jpeg','image/webp','video/mp4','audio/mpeg','text/vtt','text/plain']),
 ('draft-media','draft-media',false,26214400,array['image/png','image/jpeg','image/webp','video/mp4','audio/mpeg','text/vtt','text/plain']),
 ('user-avatars','user-avatars',false,2097152,array['image/png','image/jpeg','image/webp'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy approved_asset_read on storage.objects for select to anon,authenticated using(
 bucket_id='published-media' and (
  exists(select 1 from public.media_assets m where m.review_status='published' and m.storage_ref='published-media/'||name)
  or exists(select 1 from public.caption_tracks c join public.media_assets m on m.id=c.media_asset_id where m.review_status='published' and c.storage_ref='published-media/'||name)
  or exists(select 1 from public.transcripts t join public.media_assets m on m.id=t.media_asset_id where m.review_status='published' and t.storage_ref='published-media/'||name)
 )
);
create policy avatar_read on storage.objects for select to authenticated using(bucket_id='user-avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy avatar_insert on storage.objects for insert to authenticated with check(bucket_id='user-avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy avatar_update on storage.objects for update to authenticated using(bucket_id='user-avatars' and (storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='user-avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy avatar_delete on storage.objects for delete to authenticated using(bucket_id='user-avatars' and (storage.foldername(name))[1]=auth.uid()::text);
