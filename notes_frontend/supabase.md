# Supabase Integration Notes

This frontend connects directly to Supabase using the official JS client.

Environment variables expected (set in .env):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

If these are not present, the app will warn in the console and Supabase calls will fail. Create a .env file from .env.example and add both values.

CRUD functions are available in:
- src/lib/supabaseClient.js
  - fetchNotes()
  - createNote(note)
  - updateNote(id, updates)
  - deleteNote(id)

Database schema (configured):
- Table: public.notes
  - id: uuid primary key default gen_random_uuid()
  - title: text not null
  - content: text
  - created_at: timestamp with time zone default now()
  - updated_at: timestamp with time zone default now()
- Trigger: trg_set_updated_at to auto-update updated_at on row updates
- Function: set_updated_at()

RLS configuration (development):
- RLS is enabled on public.notes.
- Permissive policies (for development/testing only) were created:
  - notes_select_all: allow select using (true)
  - notes_insert_all: allow insert with check (true)
  - notes_update_all: allow update using (true) with check (true)
  - notes_delete_all: allow delete using (true)

Important: These policies allow anonymous CRUD access and should not be used in production as-is. Replace with user-scoped policies when you add authentication.

What was done via Supabase configuration tools:
1) Verified the presence of the notes table.
2) Migrated schema to match the recommended structure:
   - Ensured id is uuid with default gen_random_uuid()
   - Ensured title is NOT NULL
   - Ensured created_at/updated_at default now()
   - (Re)created set_updated_at() and trg_set_updated_at trigger
3) Enabled RLS and added permissive policies for development (idempotent creation).
4) Confirmed integration points in frontend code.

Local development steps:
1) Create .env from .env.example
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_KEY=your_supabase_anon_key

2) Ensure your Supabase project has the notes table and policies (already applied by tools above). The SQL is also available in supabase_schema.sql.

3) Run the app:
   npm install
   npm start

Production notes:
- Replace permissive RLS with user-scoped policies once auth is introduced.
- Consider using service_role key on your backend and not exposing elevated keys to the browser.
- Lock down redirect URLs and CORS in the Supabase dashboard as needed.
