-- Existing Auth identities can predate app migrations. Bootstrap only missing app rows;
-- never replace an existing account's preferences or trusted learning records.
insert into public.profiles(id,display_name)
select id,left(coalesce(raw_user_meta_data->>'displayName',''),100) from auth.users
on conflict(id) do nothing;
insert into public.user_settings(user_id,account_timezone)
select u.id,case when exists(select 1 from pg_timezone_names tz where tz.name=u.raw_user_meta_data->>'timezone')
 then u.raw_user_meta_data->>'timezone' else 'Asia/Ho_Chi_Minh' end
from auth.users u on conflict(user_id) do nothing;
insert into public.user_streaks(user_id)
select id from auth.users on conflict(user_id) do nothing;
