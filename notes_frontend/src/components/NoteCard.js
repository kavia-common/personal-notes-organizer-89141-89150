import React from 'react';

/**
 * NoteCard component displaying a note.
 * This is an internal component to keep App.js clean.
 */
export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note" onClick={() => onEdit(note)} role="button">
      <h4>{note.title || 'Untitled'}</h4>
      {note.content ? <p>{note.content}</p> : <p className="helper">No content</p>}
      <div className="note-meta">
        <span>{note.updated_at ? new Date(note.updated_at).toLocaleString() : '—'}</span>
        <div className="note-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn" onClick={() => onEdit(note)}>Edit</button>
          <button className="btn btn-danger" onClick={() => onDelete(note.id)}>Delete</button>
        </div>
      </div>
    </article>
  );
}
