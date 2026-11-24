-- Run against an isolated database after both migrations, as a database owner.
begin;

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000011'),
  ('00000000-0000-0000-0000-000000000012');
insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000011');
insert into public.cards (id, question, answer, status) values
  ('10000000-0000-0000-0000-000000000011', 'Draft', 'Answer', 'draft'),
  ('10000000-0000-0000-0000-000000000012', 'Reviewed', 'Answer', 'published'),
  ('10000000-0000-0000-0000-000000000013', 'Unreviewed', 'Answer', 'published');
insert into public.review_events (user_id, card_id, rating, review_kind)
values ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012', 3, 'practice');
insert into public.card_topics (card_id, topic_id)
select '10000000-0000-0000-0000-000000000011', id from public.topics where slug = 'react';

set local role anon;
do $$
begin
  begin
    perform public.admin_remove_card('10000000-0000-0000-0000-000000000013');
    raise exception 'anonymous users must not execute admin functions';
  exception when insufficient_privilege then null;
  end;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000012', true);
do $$
begin
  if public.is_admin() or exists (select 1 from public.cards where status = 'draft') then
    raise exception 'ordinary users must not see draft cards';
  end if;
  if exists (select 1 from public.card_topics where card_id = '10000000-0000-0000-0000-000000000011') then
    raise exception 'ordinary users must not see draft topics';
  end if;
  begin
    perform public.admin_save_card(null, 'Question', 'Answer', null, 'draft',
      array[(select id from public.topics where slug = 'react')]);
    raise exception 'ordinary users must not save cards';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.admin_remove_card('10000000-0000-0000-0000-000000000013');
    raise exception 'ordinary users must not remove cards';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000011', true);
do $$
declare
  new_id uuid;
  react_id uuid;
  typescript_id uuid;
  removal_result text;
begin
  select id into react_id from public.topics where slug = 'react';
  select id into typescript_id from public.topics where slug = 'typescript';
  if not public.is_admin() or not exists (select 1 from public.cards where status = 'draft') then
    raise exception 'admins must see drafts';
  end if;
  if not exists (select 1 from public.card_topics where card_id = '10000000-0000-0000-0000-000000000011') then
    raise exception 'admins must see draft topics';
  end if;
  if exists (select 1 from public.review_events) then
    raise exception 'admins must not see other users'' reviews';
  end if;
  new_id := public.admin_save_card(null, '# Markdown', 'Answer', null, 'draft', array[react_id]);
  perform public.admin_save_card(new_id, 'Updated', 'Answer', 'Details', 'published', array[typescript_id]);
  if not exists (select 1 from public.cards where id = new_id and question = 'Updated' and status = 'published')
    or (select count(*) from public.card_topics where card_id = new_id and topic_id = typescript_id) <> 1
    or exists (select 1 from public.card_topics where card_id = new_id and topic_id = react_id) then
    raise exception 'card and topic changes must be saved together';
  end if;
  begin
    perform public.admin_save_card(new_id, 'Should roll back', 'Answer', null, 'draft',
      array['99999999-9999-9999-9999-999999999999'::uuid]);
    raise exception 'invalid topics must be rejected';
  exception when foreign_key_violation then null;
  end;
  if not exists (select 1 from public.cards where id = new_id and question = 'Updated')
    or not exists (select 1 from public.card_topics where card_id = new_id and topic_id = typescript_id) then
    raise exception 'failed saves must roll back card and topics';
  end if;
  removal_result := public.admin_remove_card('10000000-0000-0000-0000-000000000013');
  if removal_result <> 'deleted'
    or exists (select 1 from public.cards where id = '10000000-0000-0000-0000-000000000013') then
    raise exception 'unreviewed cards must be deleted';
  end if;
  removal_result := public.admin_remove_card('10000000-0000-0000-0000-000000000012');
  if removal_result <> 'archived'
    or not exists (select 1 from public.cards where id = '10000000-0000-0000-0000-000000000012' and status = 'archived') then
    raise exception 'reviewed cards must be archived';
  end if;
end $$;

reset role;
do $$
begin
  if not exists (select 1 from public.review_events where card_id = '10000000-0000-0000-0000-000000000012') then
    raise exception 'review history must be retained';
  end if;
end $$;
rollback;
