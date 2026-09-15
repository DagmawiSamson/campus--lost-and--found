begin;

create table public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null
    check (char_length(trim(name)) between 1 and 100),
  location text not null
    check (char_length(trim(location)) between 1 and 200),
  status text not null
    check (status in ('Lost', 'Found')),
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;

revoke all on table public.items from anon, authenticated;

grant select, insert on table public.items
  to anon, authenticated;

create policy "Anyone can read posts"
  on public.items
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can add posts"
  on public.items
  for insert
  to anon, authenticated
  with check (true);

commit;