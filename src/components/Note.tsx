import { useState } from 'react';
import type { TextNote, TodoNote, ImageNote } from '../types/Note';

interface NoteProps {
  note: TextNote | TodoNote | ImageNote;
  onUpdate: (note: TextNote | TodoNote | ImageNote) => void;
  onDelete: (id: string) => void;
  onExport: (note: TextNote | TodoNote | ImageNote, format: 'text' | 'png') => void;
}

export function Note({ note, onUpdate, onDelete, onExport }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (title !== note.title) {
      onUpdate({ ...note, title } as any);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  const getNoteColor = () => {
    return note.color || 'bg-white';
  };

  return (
    <div className={`rounded-lg shadow-md p-4 ${getNoteColor()} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyPress={handleKeyPress}
            className="w-full text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <h3
            className="text-lg font-semibold cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {note.title}
          </h3>
        )}
        <button
          onClick={() => onExport(note, 'text')}
          className="p-1 text-gray-600 hover:text-blue-500 transition-colors"
          title="Export as text"
        >
          📝
        </button>
        <button
          onClick={() => onExport(note, 'png')}
          className="p-1 text-gray-600 hover:text-blue-500 transition-colors"
          title="Export as PNG"
        >
          🖼️
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-1 text-gray-600 hover:text-red-500 transition-colors"
          title="Delete note"
        >
          🗑️
        </button>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        {new Date(note.updatedAt).toLocaleString()}
      </div>
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* Note content will be rendered by specific note type components */}
      {note.type === 'text' && (
        <p className="whitespace-pre-wrap">{(note as TextNote).content}</p>
      )}
      {note.type === 'todo' && (
        <ul className="space-y-1">
          {(note as TodoNote).items.map((item) => (
            <li key={item.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => {
                  const newItems = (note as TodoNote).items.map(i =>
                    i.id === item.id ? { ...i, completed: !i.completed } : i
                  );
                  onUpdate({ ...note, items: newItems } as TodoNote);
                }}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className={item.completed ? 'line-through text-gray-500' : ''}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      )}
      {note.type === 'image' && (
        <div>
          <img
            src={(note as ImageNote).imageUrl}
            alt={(note as ImageNote).caption || 'Note image'}
            className="max-w-full h-auto rounded"
          />
          {(note as ImageNote).caption && (
            <p className="mt-2 text-sm text-gray-600">
              {(note as ImageNote).caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 