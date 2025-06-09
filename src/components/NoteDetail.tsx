import { useState, useEffect } from 'react';
import type { Note, TextNote, TodoNote, ImageNote, TodoItem } from '../types/Note';

interface NoteDetailProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onClose: () => void;
  onDelete: () => void;
}

export function NoteDetail({ note, onUpdate, onClose, onDelete }: NoteDetailProps) {
  const [editedNote, setEditedNote] = useState<Note>(note);

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSave = () => {
    onUpdate({
      ...editedNote,
      updatedAt: new Date(),
    });
  };

  const handleCancel = () => {
    setEditedNote(note);
    onClose();
  };

  const renderTextNote = (note: TextNote) => (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Název
        </label>
        <input
          type="text"
          id="title"
          value={note.title}
          onChange={(e) =>
            setEditedNote({ ...note, title: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Obsah
        </label>
        <textarea
          id="content"
          rows={10}
          value={note.content}
          onChange={(e) =>
            setEditedNote({ ...note, content: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );

  const renderTodoNote = (note: TodoNote) => (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Název
        </label>
        <input
          type="text"
          id="title"
          value={note.title}
          onChange={(e) =>
            setEditedNote({ ...note, title: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Úkoly</label>
        <div className="mt-2 space-y-2">
          {note.items.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => {
                  const newItems = [...note.items];
                  newItems[index] = {
                    ...item,
                    completed: e.target.checked,
                  };
                  setEditedNote({ ...note, items: newItems });
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => {
                  const newItems = [...note.items];
                  newItems[index] = {
                    ...item,
                    text: e.target.value,
                  };
                  setEditedNote({ ...note, items: newItems });
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                onClick={() => {
                  const newItems = note.items.filter((_, i) => i !== index);
                  setEditedNote({ ...note, items: newItems });
                }}
                className="text-red-600 hover:text-red-800"
              >
                Smazat
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItem: TodoItem = {
                id: Math.random().toString(36).substring(2),
                text: '',
                completed: false,
              };
              setEditedNote({
                ...note,
                items: [...note.items, newItem],
              });
            }}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Přidat úkol
          </button>
        </div>
      </div>
    </div>
  );

  const renderImageNote = (note: ImageNote) => (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Název
        </label>
        <input
          type="text"
          id="title"
          value={note.title}
          onChange={(e) =>
            setEditedNote({ ...note, title: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          URL obrázku
        </label>
        <input
          type="url"
          id="imageUrl"
          value={note.imageUrl}
          onChange={(e) =>
            setEditedNote({ ...note, imageUrl: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {note.imageUrl && (
        <div className="mt-2">
          <img
            src={note.imageUrl}
            alt={note.caption || note.title}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
      <div>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
          Popisek
        </label>
        <textarea
          id="caption"
          rows={3}
          value={note.caption}
          onChange={(e) =>
            setEditedNote({ ...note, caption: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {note.type === 'text' && 'Textová poznámka'}
            {note.type === 'todo' && 'Seznam úkolů'}
            {note.type === 'image' && 'Obrázek s popiskem'}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Uložit
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Zrušit
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Smazat
            </button>
          </div>
        </div>

        {note.type === 'text' && renderTextNote(editedNote as TextNote)}
        {note.type === 'todo' && renderTodoNote(editedNote as TodoNote)}
        {note.type === 'image' && renderImageNote(editedNote as ImageNote)}
      </div>
    </div>
  );
} 