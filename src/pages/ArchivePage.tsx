import { useState } from 'react';
import type { Note } from '../types/Note';

interface ArchivedNote {
  id: string;
  title: string;
  type: 'text' | 'todo' | 'image';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  color?: string;
  tags?: string[];
  archivedAt: Date;
  // Specifické vlastnosti podle typu
  content?: string; // pro text
  items?: Array<{ id: string; text: string; completed: boolean }>; // pro todo
  imageUrl?: string; // pro image
  caption?: string; // pro image
}

interface ArchivePageProps {
  notes?: Note[];
  archivedNotes?: ArchivedNote[];
  onArchiveNote?: (noteId: string) => void;
  onRestoreNote?: (noteId: string) => void;
  onDeleteNote?: (noteId: string) => void;
}

export function ArchivePage({ 
  notes = [], 
  archivedNotes = [], 
  onArchiveNote, 
  onRestoreNote, 
  onDeleteNote 
}: ArchivePageProps) {
  const [selectedNote, setSelectedNote] = useState<ArchivedNote | null>(null);
  const [success, setSuccess] = useState('');

  const handleRestoreNote = (noteId: string) => {
    if (onRestoreNote) {
      onRestoreNote(noteId);
      setSuccess('Poznámka byla úspěšně obnovena');
    }
    setSelectedNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    if (onDeleteNote) {
      onDeleteNote(noteId);
      setSuccess('Poznámka byla úspěšně smazána');
    }
    setSelectedNote(null);
  };

  const handleArchiveNote = (noteId: string) => {
    if (onArchiveNote) {
      onArchiveNote(noteId);
      setSuccess('Poznámka byla úspěšně archivována');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Hlavička */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Archiv poznámek</h1>
          <div className="text-sm text-gray-500">
            Celkem {archivedNotes.length} {archivedNotes.length === 1 ? 'poznámka' : 
              archivedNotes.length >= 2 && archivedNotes.length <= 4 ? 'poznámky' : 'poznámek'} v archivu
          </div>
        </div>

        {/* Hlavní obsah */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seznam archivovaných poznámek */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sekce pro archivaci aktivních poznámek */}
            {notes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Archivovat aktivní poznámky</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.slice(0, 4).map((note) => (
                    <div
                      key={note.id}
                      className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-300 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{note.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {note.type === 'text' ? 'Textová poznámka' :
                             note.type === 'todo' ? 'Seznam úkolů' :
                             'Obrázek s popiskem'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleArchiveNote(note.id)}
                          className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors duration-200"
                          title="Archivovat poznámku"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {notes.length > 4 && (
                  <p className="text-sm text-blue-600 mt-3">
                    Zobrazuje se {4} z {notes.length} aktivních poznámek
                  </p>
                )}
              </div>
            )}

            {/* Seznam archivovaných poznámek */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Archivované poznámky</h3>
            {archivedNotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a2 2 0 00-2-2H9a2 2 0 00-2 2v1m4 0V4a2 2 0 00-2-2H9a2 2 0 00-2 2v1m4 0h6" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Žádné archivované poznámky</h3>
                  <p className="text-gray-600">Zatím nemáte žádné archivované poznámky.</p>
                </div>
              </div>
            ) : (
              archivedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 
                    transform transition-all duration-200 hover:shadow-xl cursor-pointer
                    ${selectedNote?.id === note.id ? 'ring-2 ring-indigo-500' : ''}`}
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {note.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Archivováno {new Date(note.archivedAt).toLocaleDateString('cs-CZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {note.color && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {note.color}
                          </span>
                        )}
                        <div className={`w-2 h-2 rounded-full ${
                          note.type === 'text' ? 'bg-indigo-500' :
                          note.type === 'todo' ? 'bg-purple-500' :
                          'bg-pink-500'
                        }`} />
                      </div>
                    </div>
                    {note.type === 'text' && (
                      <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                        {note.content}
                      </p>
                    )}
                    {note.type === 'todo' && (
                      <div className="mt-4 text-sm text-gray-600">
                        Seznam úkolů
                      </div>
                    )}
                    {note.type === 'image' && (
                      <div className="mt-4 relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail vybrané poznámky */}
          <div className="lg:col-span-1">
            {selectedNote ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedNote.title}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Typ poznámky</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedNote.type === 'text' ? 'Textová poznámka' :
                       selectedNote.type === 'todo' ? 'Seznam úkolů' :
                       'Obrázek s popiskem'}
                    </p>
                  </div>
                  {selectedNote.color && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Kategorie</h3>
                      <p className="mt-1 text-sm text-gray-900">{selectedNote.color}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Archivováno</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedNote.archivedAt).toLocaleDateString('cs-CZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="pt-4 space-y-3">
                    <button
                      onClick={() => handleRestoreNote(selectedNote.id)}
                      className="w-full inline-flex justify-center items-center px-4 py-2 rounded-xl text-sm font-medium text-white 
                        bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                        transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                        shadow-lg shadow-indigo-500/25"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Obnovit poznámku
                    </button>
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      className="w-full inline-flex justify-center items-center px-4 py-2 rounded-xl text-sm font-medium text-red-700 
                        bg-white border border-red-300 hover:bg-red-50 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
                        transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                        shadow-sm"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Trvale smazat
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 sticky top-8">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Žádná poznámka vybrána</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Vyberte poznámku z archivu pro zobrazení detailů
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zprávy o chybách a úspěchu */}
        {success && (
          <div className="rounded-xl bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 