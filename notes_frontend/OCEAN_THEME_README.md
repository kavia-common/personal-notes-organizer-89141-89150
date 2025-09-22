# Ocean Notes Frontend

A minimalist React app for personal notes with Ocean Professional theme and Supabase CRUD.

## Setup
1. Copy `.env.example` to `.env` and set:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_KEY

2. Ensure your Supabase has a `notes` table:
```sql
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Optional: update trigger for updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.notes;
create trigger trg_set_updated_at
before update on public.notes
for each row execute function set_updated_at();
```

3. Run the app:
- npm install
- npm start

## Theme
- Primary: #2563EB
- Secondary: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827
- Subtle gradients, rounded corners, smooth transitions.

## Notes
- No authentication included. All operations use the provided anon key.
- Public interfaces in `src/lib/supabaseClient.js`: fetchNotes, createNote, updateNote, deleteNote.
