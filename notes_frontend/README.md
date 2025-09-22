# Ocean Notes - Personal Notes Organizer (React + Supabase)

A modern, minimalist notes application with an Ocean Professional theme.

## Requirements
- Node.js 16+
- Supabase project credentials

## Setup
1. Copy `.env.example` to `.env` and set:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_KEY

2. Ensure Supabase has a `notes` table (see `OCEAN_THEME_README.md` for SQL).

3. Install dependencies and run:
```bash
npm install
npm start
```

## Features
- Add, edit, delete, and view notes
- Ocean Professional theme (blue & amber accents)
- Smooth transitions, subtle gradients, rounded corners
- Supabase integration via env vars

## Public Interfaces
- src/lib/supabaseClient.js
  - fetchNotes()
  - createNote(note)
  - updateNote(id, updates)
  - deleteNote(id)

## Environment Variables
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Note: Do not hardcode credentials. Use .env per environment.

## Scripts
- npm start
- npm build
- npm test
