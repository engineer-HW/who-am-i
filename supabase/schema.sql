create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  favorite_id text not null,
  nickname text not null,
  mbti text not null,
  bio text not null,
  updated_at timestamptz default now()
);

create table if not exists public.dictionaries (
  id uuid primary key references auth.users(id) on delete cascade,
  reading text[] not null default '{}',
  habits text[] not null default '{}',
  games text[] not null default '{}',
  values text[] not null default '{}',
  updated_at timestamptz default now()
);

create table if not exists public.social_links (
  id uuid primary key references auth.users(id) on delete cascade,
  x_url text,
  instagram_url text,
  youtube_url text,
  updated_at timestamptz default now()
);

create table if not exists public.share_urls (
  id uuid primary key references auth.users(id) on delete cascade,
  share_url text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('pending', 'approved')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.dictionaries enable row level security;
alter table public.social_links enable row level security;
alter table public.share_urls enable row level security;
alter table public.connections enable row level security;

create policy "profiles_owner" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "dictionaries_owner" on public.dictionaries
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "social_links_owner" on public.social_links
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "share_urls_owner" on public.share_urls
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "connections_requester" on public.connections
  for select using (auth.uid() = requester_id)
  with check (auth.uid() = requester_id);

create policy "profiles_approved_friend" on public.profiles
  for select using (
    auth.uid() = id
    or exists (
      select 1
      from public.connections
      where requester_id = auth.uid()
        and friend_id = profiles.id
        and status = 'approved'
    )
  );

create policy "dictionaries_approved_friend" on public.dictionaries
  for select using (
    auth.uid() = id
    or exists (
      select 1
      from public.connections
      where requester_id = auth.uid()
        and friend_id = dictionaries.id
        and status = 'approved'
    )
  );
