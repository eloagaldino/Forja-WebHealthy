
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  idade int,
  genero text,
  peso numeric,
  altura numeric,
  objetivo text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Usuário vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário insere o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuário atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ------------------------------------------------------------------ MEALS
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  nome text not null,
  kcal int not null,
  tipo text not null,
  created_at timestamptz default now()
);

create index if not exists meals_user_date_idx on public.meals (user_id, date);

alter table public.meals enable row level security;

create policy "Usuário vê as próprias refeições"
  on public.meals for select
  using (auth.uid() = user_id);

create policy "Usuário insere as próprias refeições"
  on public.meals for insert
  with check (auth.uid() = user_id);

create policy "Usuário remove as próprias refeições"
  on public.meals for delete
  using (auth.uid() = user_id);

-- --------------------------------------------------------- WORKOUT_PROGRESS
-- 1 linha por exercício marcado/registrado, chave = "objetivo__dia__indice".
create table if not exists public.workout_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null,
  done boolean default false,
  carga text default '',
  updated_at timestamptz default now(),
  unique (user_id, key)
);

alter table public.workout_progress enable row level security;

create policy "Usuário vê o próprio progresso de treino"
  on public.workout_progress for select
  using (auth.uid() = user_id);

create policy "Usuário grava o próprio progresso de treino"
  on public.workout_progress for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza o próprio progresso de treino"
  on public.workout_progress for update
  using (auth.uid() = user_id);

-- =========================================================================
-- Fim do schema.
--
-- Dica de configuração (Authentication → Providers → Email):
-- se quiser que o cadastro já logue o usuário na hora (sem precisar
-- confirmar e-mail), desative "Confirm email" durante o desenvolvimento.
-- Em produção, o recomendado é deixar essa confirmação ativada.
-- =========================================================================
