import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { createNote, deleteNote, fetchNotes, updateNote } from './lib/supabaseClient';

// PUBLIC_INTERFACE
export default function App() {
  /**
   * Main entry point for the Notes App UI.
   * Provides layout, list of notes, modal for add/edit, and CRUD using Supabase.
   */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState({ id: null, title: '', content: '' });
  const [error, setError] = useState('');

  // Load notes on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchNotes();
        if (mounted) setNotes(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(e.message || 'Failed to load notes');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, search]);

  const openCreate = () => {
    setDraft({ id: null, title: '', content: '' });
    setIsModalOpen(true);
  };

  const openEdit = (note) => {
    setDraft({ id: note.id, title: note.title || '', content: note.content || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const onChangeDraft = (field, value) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  // PUBLIC_INTERFACE
  async function saveDraft() {
    /**
     * Save the current draft. Creates or updates depending on presence of id.
     * Validates title.
     */
    setError('');
    if (!draft.title.trim()) {
      setError('Title is required.');
      return;
    }
    try {
      if (draft.id) {
        const updated = await updateNote(draft.id, {
          title: draft.title,
          content: draft.content,
        });
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      } else {
        const created = await createNote({
          title: draft.title,
          content: draft.content,
        });
        setNotes((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError(e.message || 'Failed to save note');
    }
  }

  // PUBLIC_INTERFACE
  async function removeNote(id) {
    /** Delete a note by id and update local state. */
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError(e.message || 'Failed to delete note');
    }
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-logo" aria-hidden />
            <h1 className="brand-title">Ocean Notes</h1>
          </div>
          <div className="actions">
            <span className="badge" title="Using Supabase">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l4 8H8l4-8zm0 20l-4-8h8l-4 8z" />
              </svg>
              Supabase Connected
            </span>
            <button className="btn btn-primary" onClick={openCreate}>+ New Note</button>
          </div>
        </div>
      </header>

      <main className="main">
        <aside className="sidebar card">
          <h3>Navigation</h3>
          <div className="search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              aria-label="Search notes"
            />
          </div>
          <div className="helper">
            Tips:
            <ul>
              <li>Use the search to filter by title or content.</li>
              <li>Click a note to edit, or use actions to manage.</li>
            </ul>
          </div>
        </aside>

        <section className="content">
          <div className="toolbar">
            <div className="helper">Notes ({filtered.length})</div>
            <div>
              <button className="btn btn-secondary" onClick={openCreate}>Create Note</button>
            </div>
          </div>

          {error ? (
            <div className="card" style={{ borderColor: 'var(--color-error)' }}>
              <strong style={{ color: 'var(--color-error)' }}>Error:</strong> {error}
            </div>
          ) : null}

          <div className="card">
            {loading ? (
              <div className="empty">Loading notes...</div>
            ) : filtered.length === 0 ? (
              <div className="empty">
                No notes yet.
                <div>
                  <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 8 }}>
                    Create your first note
                  </button>
                </div>
              </div>
            ) : (
              <div className="note-list">
                {filtered.map((n) => (
                  <article key={n.id} className="note" onClick={() => openEdit(n)} role="button">
                    <h4>{n.title || 'Untitled'}</h4>
                    {n.content ? <p>{n.content}</p> : <p className="helper">No content</p>}
                    <div className="note-meta">
                      <span>
                        {n.updated_at ? new Date(n.updated_at).toLocaleString() : '—'}
                      </span>
                      <div className="note-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="btn" onClick={() => openEdit(n)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => removeNote(n.id)}>Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {isModalOpen ? (
        <div className="modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{draft.id ? 'Edit Note' : 'New Note'}</h3>
              <button className="btn" onClick={closeModal} aria-label="Close">Close</button>
            </div>
            <div className="form">
              <input
                className="input"
                placeholder="Title"
                value={draft.title}
                onChange={(e) => onChangeDraft('title', e.target.value)}
              />
              <textarea
                className="textarea"
                placeholder="Write your note..."
                value={draft.content}
                onChange={(e) => onChangeDraft('content', e.target.value)}
              />
              <div className="form-actions">
                <button className="btn" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={saveDraft}>
                  {draft.id ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
              <div className="helper">
                Fields are saved to your Supabase "notes" table. Make sure columns: id (uuid or int), title (text), content (text), created_at (timestamp default now), updated_at (timestamp default now or trigger).
              </div>
              {error ? (
                <div className="helper" style={{ color: 'var(--color-error)' }}>
                  {error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
