-- Align table names with GLOSSARY.md: a Review is one learner rating one Card at one moment.

alter table public.review_events rename to reviews;

alter table public.reviews rename constraint review_events_pkey to reviews_pkey;
alter table public.reviews rename constraint review_events_user_id_fkey to reviews_user_id_fkey;
alter table public.reviews rename constraint review_events_card_id_fkey to reviews_card_id_fkey;
alter table public.reviews rename constraint review_events_rating_check to reviews_rating_check;
alter table public.reviews rename constraint review_events_review_kind_check to reviews_review_kind_check;

alter index public.review_events_user_card_time_idx rename to reviews_user_card_time_idx;
alter index public.review_events_card_id_idx rename to reviews_card_id_idx;

alter policy "Users can read their review events" on public.reviews
  rename to "Users can read their reviews";
alter policy "Users can create their review events for published cards" on public.reviews
  rename to "Users can create their reviews for published cards";

-- Function bodies reference tables by name, so recreate the one that read review_events.
-- create or replace keeps the existing grants.
create or replace function public.admin_remove_card(p_id uuid)
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

  if exists (select 1 from public.reviews where card_id = p_id)
    or exists (select 1 from public.card_schedules where card_id = p_id) then
    update public.cards set status = 'archived', updated_at = now() where id = p_id;
    return 'archived';
  end if;

  delete from public.cards where id = p_id;
  return 'deleted';
end;
$$;
