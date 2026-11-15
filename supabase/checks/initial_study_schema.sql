-- Run against an isolated database after applying the migration, as a database owner.
begin;

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002');

insert into public.cards (id, question, answer, status) values
  ('10000000-0000-0000-0000-000000000001', 'Question', 'Answer', 'published'),
  ('10000000-0000-0000-0000-000000000002', 'Draft', 'Answer', 'draft'),
  ('10000000-0000-0000-0000-000000000003', 'Archived', 'Answer', 'archived');

insert into public.card_topics (card_id, topic_id)
select '10000000-0000-0000-0000-000000000001', id from public.topics
where slug in ('react', 'typescript');

insert into public.card_references (card_id, title, url) values
  ('10000000-0000-0000-0000-000000000002', 'Draft reference', 'https://example.com');

set local role anon;
do $$
begin
  begin
    perform * from public.cards;
    raise exception 'anonymous users must not read cards';
  exception when insufficient_privilege then null;
  end;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

do $$
begin
  if (select count(*) from public.cards) <> 1 then
    raise exception 'only published cards should be visible';
  end if;
  if (select count(*) from public.card_topics) <> 2 then
    raise exception 'a published card should support multiple topics';
  end if;
  if exists (select 1 from public.card_references) then
    raise exception 'draft references must not be visible';
  end if;
  begin
    insert into public.cards (question, answer) values ('Not allowed', 'Answer');
    raise exception 'users must not create cards';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.card_schedules (user_id, card_id, due_at)
    values ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', now());
    raise exception 'users must not create schedules for another user';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.card_schedules (user_id, card_id, due_at)
    values ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', now());
    raise exception 'users must not create schedules for unpublished cards';
  exception when insufficient_privilege then null;
  end;
end $$;

insert into public.card_schedules (user_id, card_id, due_at)
values ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', now());

insert into public.review_events (user_id, card_id, rating, review_kind)
values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1, 'scheduled'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 4, 'practice');

do $$
begin
  begin
    insert into public.review_events (user_id, card_id, rating, review_kind)
    values ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 5, 'scheduled');
    raise exception 'invalid ratings must be rejected';
  exception when check_violation then null;
  end;
  begin
    delete from public.review_events;
    raise exception 'users must not delete review events';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);

do $$
begin
  if exists (select 1 from public.card_schedules) or exists (select 1 from public.review_events) then
    raise exception 'users must not see another user''s study data';
  end if;
  update public.card_schedules set reps = 1;
  if found then
    raise exception 'users must not update another user''s schedule';
  end if;
  begin
    insert into public.review_events (user_id, card_id, rating, review_kind)
    values ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 3, 'scheduled');
    raise exception 'users must not create reviews for another user';
  exception when insufficient_privilege then null;
  end;
end $$;

rollback;
