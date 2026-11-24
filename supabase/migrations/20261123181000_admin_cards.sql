create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admin_users enable row level security;
revoke all on public.admin_users from public, anon, authenticated;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "Admins can read all cards"
  on public.cards for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can read all card topics"
  on public.card_topics for select to authenticated
  using ((select public.is_admin()));

create function public.admin_save_card(
  p_id uuid,
  p_question text,
  p_answer text,
  p_more_info text,
  p_status text,
  p_topic_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  if p_question is null or length(btrim(p_question)) = 0
    or p_answer is null or length(btrim(p_answer)) = 0
    or p_status is null or p_status not in ('draft', 'published', 'archived')
    or p_topic_ids is null or cardinality(p_topic_ids) = 0
    or array_position(p_topic_ids, null) is not null then
    raise exception 'Invalid card data' using errcode = '22023';
  end if;

  if p_id is null then
    insert into public.cards (question, answer, more_info, status)
    values (p_question, p_answer, case when btrim(p_more_info) = '' then null else p_more_info end, p_status)
    returning id into saved_id;
  else
    update public.cards
    set question = p_question, answer = p_answer,
        more_info = case when btrim(p_more_info) = '' then null else p_more_info end, status = p_status,
        updated_at = now()
    where id = p_id
    returning id into saved_id;
    if saved_id is null then
      raise exception 'Card not found' using errcode = 'P0002';
    end if;
  end if;

  delete from public.card_topics where card_id = saved_id;
  insert into public.card_topics (card_id, topic_id)
  select saved_id, topic_id from unnest(p_topic_ids) as topic_id
  group by topic_id;
  return saved_id;
end;
$$;

revoke all on function public.admin_save_card(uuid, text, text, text, text, uuid[]) from public, anon;
grant execute on function public.admin_save_card(uuid, text, text, text, text, uuid[]) to authenticated;

create function public.admin_remove_card(p_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  perform 1 from public.cards where id = p_id for update;
  if not found then
    raise exception 'Card not found' using errcode = 'P0002';
  end if;

  if exists (select 1 from public.review_events where card_id = p_id)
    or exists (select 1 from public.card_schedules where card_id = p_id) then
    update public.cards set status = 'archived', updated_at = now() where id = p_id;
    return 'archived';
  end if;

  delete from public.cards where id = p_id;
  return 'deleted';
end;
$$;

revoke all on function public.admin_remove_card(uuid) from public, anon;
grant execute on function public.admin_remove_card(uuid) to authenticated;
