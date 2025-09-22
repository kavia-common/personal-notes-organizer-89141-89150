# Supabase Integration Notes

This frontend connects directly to Supabase using the official JS client.

Environment variables expected (set in .env):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

CRUD functions are available in:
- src/lib/supabaseClient.js
  - fetchNotes()
  - createNote(note)
  - updateNote(id, updates)
  - deleteNote(id)

Database schema (recommended):
- Table: notes
  - id: uuid primary key (default gen_random_uuid() or uuid_generate_v4())
  - title: text not null
  - content: text
  - created_at: timestamp with time zone default now()
  - updated_at: timestamp with time zone default now()

Optional trigger to maintain updated_at is included in OCEAN_THEME_README.md.

No authentication is required for this stage. Ensure your RLS policies permit anonymous CRUD for the `notes` table in your testing environment or adjust policies as needed.
