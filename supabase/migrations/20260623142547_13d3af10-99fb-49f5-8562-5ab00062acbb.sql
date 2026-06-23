
-- Profiles
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  husband_name text,
  marriage_date date,
  spiritual_season text,
  timezone text default 'America/New_York',
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Own profile select" on public.profiles for select to authenticated using (auth.uid() = user_id);
create policy "Own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "Own profile update" on public.profiles for update to authenticated using (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- Gratitude entries
create table public.gratitude_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  items text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index gratitude_user_day_idx on public.gratitude_entries(user_id, day desc);
grant select, insert, update, delete on public.gratitude_entries to authenticated;
grant all on public.gratitude_entries to service_role;
alter table public.gratitude_entries enable row level security;
create policy "Own gratitude" on public.gratitude_entries for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SOAP entries
create table public.soap_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  scripture_ref text,
  scripture_text text,
  observation text,
  application text,
  prayer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index soap_user_day_idx on public.soap_entries(user_id, day desc);
grant select, insert, update, delete on public.soap_entries to authenticated;
grant all on public.soap_entries to service_role;
alter table public.soap_entries enable row level security;
create policy "Own soap" on public.soap_entries for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger soap_touch before update on public.soap_entries for each row execute function public.touch_updated_at();

-- Prayer entries
create table public.prayer_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  answered boolean not null default false,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);
create index prayer_user_idx on public.prayer_entries(user_id, created_at desc);
grant select, insert, update, delete on public.prayer_entries to authenticated;
grant all on public.prayer_entries to service_role;
alter table public.prayer_entries enable row level security;
create policy "Own prayer" on public.prayer_entries for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Dare completions
create table public.dare_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dare_id text not null,
  dare_title text,
  completed_at timestamptz not null default now()
);
create index dare_user_idx on public.dare_completions(user_id, completed_at desc);
grant select, insert, update, delete on public.dare_completions to authenticated;
grant all on public.dare_completions to service_role;
alter table public.dare_completions enable row level security;
create policy "Own dares" on public.dare_completions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Daily completions (for streak)
create table public.daily_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  items jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, day)
);
grant select, insert, update, delete on public.daily_completions to authenticated;
grant all on public.daily_completions to service_role;
alter table public.daily_completions enable row level security;
create policy "Own daily" on public.daily_completions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Assessment responses
create table public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scores jsonb not null,
  strongest_pillar text,
  weakest_pillar text,
  created_at timestamptz not null default now()
);
create index assessment_user_idx on public.assessment_responses(user_id, created_at desc);
grant select, insert, update, delete on public.assessment_responses to authenticated;
grant all on public.assessment_responses to service_role;
alter table public.assessment_responses enable row level security;
create policy "Own assessment" on public.assessment_responses for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
