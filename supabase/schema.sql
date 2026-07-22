-- Mon Chemin vers Allah — schéma Supabase (optionnel)
-- À exécuter dans l'éditeur SQL de votre projet Supabase.
-- L'application fonctionne sans cette base (stockage local du navigateur) ;
-- ce schéma sert uniquement si vous activez la synchronisation cloud (voir README.md).

create extension if not exists "uuid-ossp";

-- Profil utilisateur (lié à auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  xp integer not null default 0,
  streak_days integer not null default 0,
  last_active_date date,
  weekly_goal_minutes integer not null default 210,
  created_at timestamptz not null default now()
);

-- Journal d'habitudes quotidiennes
create table if not exists public.habit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id text not null,
  log_date date not null,
  done boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, habit_id, log_date)
);

-- Journal "Mon Combat" (rechutes et réflexions)
create table if not exists public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_type text not null check (entry_type in ('relapse', 'reflexion')),
  entry_date date not null default current_date,
  trigger text,
  note text,
  created_at timestamptz not null default now()
);

-- Mémorisation des adhkar
create table if not exists public.adhkar_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  dhikr_id text not null,
  memorized boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, dhikr_id)
);

-- Notes personnelles sur un contenu (cours, hadith, page de Coran, etc.)
create table if not exists public.notes (
  user_id uuid not null references auth.users (id) on delete cascade,
  content_id text not null,
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, content_id)
);

-- Favoris
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  content_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, content_id)
);

-- Scores de quiz
create table if not exists public.quiz_scores (
  user_id uuid not null references auth.users (id) on delete cascade,
  category_slug text not null,
  best_score integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, category_slug)
);

-- Bibliothèque personnelle (métadonnées ; les fichiers PDF vont dans Supabase Storage)
create table if not exists public.library_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text,
  storage_path text, -- chemin dans le bucket Supabase Storage "library"
  pages integer,
  progress integer not null default 0,
  favorite boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security : chaque utilisateur ne voit que ses propres données
alter table public.profiles enable row level security;
alter table public.habit_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.adhkar_progress enable row level security;
alter table public.notes enable row level security;
alter table public.favorites enable row level security;
alter table public.quiz_scores enable row level security;
alter table public.library_items enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own habit logs" on public.habit_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own journal" on public.journal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own adhkar" on public.adhkar_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own notes" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own quiz scores" on public.quiz_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own library" on public.library_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bucket de stockage pour les PDF (à créer aussi depuis l'onglet Storage)
insert into storage.buckets (id, name, public) values ('library', 'library', false)
  on conflict (id) do nothing;

create policy "own library files read" on storage.objects for select
  using (bucket_id = 'library' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "own library files write" on storage.objects for insert
  with check (bucket_id = 'library' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "own library files delete" on storage.objects for delete
  using (bucket_id = 'library' and auth.uid()::text = (storage.foldername(name))[1]);
