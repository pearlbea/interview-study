create table public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null unique check (length(btrim(name)) > 0),
  created_at timestamptz not null default now()
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  question text not null check (length(btrim(question)) > 0),
  answer text not null check (length(btrim(answer)) > 0),
  more_info text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.card_topics (
  card_id uuid not null references public.cards(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete restrict,
  primary key (card_id, topic_id)
);

create index card_topics_topic_id_idx on public.card_topics (topic_id, card_id);

create table public.card_references (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  title text not null check (length(btrim(title)) > 0),
  url text not null check (url ~* '^https?://[^[:space:]]+$'),
  position integer not null default 0 check (position >= 0)
);

create index card_references_card_id_idx on public.card_references (card_id, position);

create table public.card_schedules (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete restrict,
  algorithm_version text not null default 'fsrs-6' check (length(btrim(algorithm_version)) > 0),
  due_at timestamptz not null,
  stability double precision not null default 0 check (stability >= 0 and stability < 'Infinity'::double precision),
  difficulty double precision not null default 0 check (difficulty >= 0 and difficulty <= 10),
  scheduled_days double precision not null default 0 check (scheduled_days >= 0 and scheduled_days < 'Infinity'::double precision),
  learning_steps integer not null default 0 check (learning_steps >= 0),
  reps integer not null default 0 check (reps >= 0),
  lapses integer not null default 0 check (lapses >= 0 and lapses <= reps),
  state smallint not null default 0 check (state between 0 and 3),
  last_review_at timestamptz,
  primary key (user_id, card_id)
);

create index card_schedules_due_idx on public.card_schedules (user_id, due_at);
create index card_schedules_card_id_idx on public.card_schedules (card_id);

create table public.review_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete restrict,
  rating smallint not null check (rating between 1 and 4),
  review_kind text not null check (review_kind in ('scheduled', 'practice')),
  reviewed_at timestamptz not null default now()
);

create index review_events_user_card_time_idx on public.review_events (user_id, card_id, reviewed_at);
create index review_events_card_id_idx on public.review_events (card_id);

alter table public.topics enable row level security;
alter table public.cards enable row level security;
alter table public.card_topics enable row level security;
alter table public.card_references enable row level security;
alter table public.card_schedules enable row level security;
alter table public.review_events enable row level security;

revoke all on public.topics, public.cards, public.card_topics, public.card_references,
  public.card_schedules, public.review_events from public, anon, authenticated;

grant select on public.topics, public.cards, public.card_topics, public.card_references
  to authenticated;
grant select, insert, update on public.card_schedules to authenticated;
grant select, insert on public.review_events to authenticated;
grant all on public.topics, public.cards, public.card_topics, public.card_references,
  public.card_schedules, public.review_events to service_role;

create policy "Signed-in users can read topics"
  on public.topics for select to authenticated using (true);

create policy "Signed-in users can read published cards"
  on public.cards for select to authenticated using (status = 'published');

create policy "Signed-in users can read published card topics"
  on public.card_topics for select to authenticated
  using (exists (select 1 from public.cards where cards.id = card_id and cards.status = 'published'));

create policy "Signed-in users can read published card references"
  on public.card_references for select to authenticated
  using (exists (select 1 from public.cards where cards.id = card_id and cards.status = 'published'));

create policy "Users can read their schedules"
  on public.card_schedules for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their schedules for published cards"
  on public.card_schedules for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.cards where cards.id = card_id and cards.status = 'published')
  );

create policy "Users can update their schedules for published cards"
  on public.card_schedules for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.cards where cards.id = card_id and cards.status = 'published')
  );

create policy "Users can read their review events"
  on public.review_events for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their review events for published cards"
  on public.review_events for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.cards where cards.id = card_id and cards.status = 'published')
  );

insert into public.topics (slug, name) values
  ('react', 'React'),
  ('typescript', 'TypeScript'),
  ('postgres', 'Postgres'),
  ('system-design', 'System Design'),
  ('claude-code', 'Claude Code'),
  ('web-performance', 'Web Performance');
