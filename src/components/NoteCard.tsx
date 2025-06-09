/**
 * Komponenta pro zobrazení karty poznámky v seznamu
 * 
 * Obsahuje:
 * - Zobrazení obsahu podle typu poznámky
 * - Drag & Drop funkcionalitu
 * - Akční tlačítka (smazat, archivovat)
 * - Todo položky s možností editace
 * 
 * @author Mike
 * @version 1.0.0
 */

import React from 'react';
import type { Note, TextNote, TodoNote, ImageNote } from '../types/Note';

interface NoteCardProps {
  note: Note;
  categories: Array<{ id: string; name: string; color: string }>;
  isDragged: boolean;
  isDragOver: boolean;
  onNoteClick: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onArchiveNote: (noteId: string) => void;
  onToggleTodoItem: (noteId: string, itemId: string) => void;
  onStartEditTodoItem: (noteId: string, itemId: string, currentText: string) => void;
  onDeleteTodoItem: (noteId: string, itemId: string) => void;
  onAddTodoItem: (noteId: string) => void;
  onDragStart: (e: React.DragEvent, noteId: string) => void;
  onDragOver: (e: React.DragEvent, noteId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetNoteId: string) => void;
  onDragEnd: () => void;
  editingTodoItem: { noteId: string; itemId: string; text: string } | null;
  onSaveTodoItemEdit: (newText: string) => void;
  onCancelTodoItemEdit: () => void;
}

/**
 * Komponenta karty poznámky
 * Zobrazuje poznámku v grid layoutu s možností interakce
 */
export function NoteCard({
  note,
  categories,
  isDragged,
  isDragOver,
  onNoteClick,
  onDeleteNote,
  onArchiveNote,
  onToggleTodoItem,
  onStartEditTodoItem,
  onDeleteTodoItem,
  onAddTodoItem,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  editingTodoItem,
  onSaveTodoItemEdit,
  onCancelTodoItemEdit
}: NoteCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, note.id)}
      onDragOver={(e) => onDragOver(e, note.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, note.id)}
      onDragEnd={onDragEnd}
      onClick={() => onNoteClick(note)}
      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-100 hover:border-indigo-200 group
        ${isDragged ? 'opacity-50 scale-95' : ''}
        ${isDragOver ? 'ring-2 ring-indigo-500 ring-opacity-50 scale-105' : ''}
        ${isDragged ? 'transform-gpu' : ''}`}
    >
      {/* Header karty */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{note.title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNote(note.id);
            }}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors duration-200"
            title="Smazat poznámku"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchiveNote(note.id);
            }}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors duration-200"
            title="Archivovat poznámku"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Obsah podle typu poznámky */}
      <div className="text-sm text-gray-600">
        {note.type === 'text' && (
          <p className="line-clamp-3">
            {(note as TextNote).content || 'Bez obsahu'}
          </p>
        )}
        
        {note.type === 'todo' && (
          <div>
            <p className="mb-2">Úkoly:</p>
            <ul className="space-y-1">
              {(note as TodoNote).items.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-center text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTodoItem(note.id, item.id);
                    }}
                    className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 transition-all duration-200 ${
                      item.completed 
                        ? 'bg-green-500 border-2 border-green-500' 
                        : 'border-2 border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {editingTodoItem?.noteId === note.id && editingTodoItem?.itemId === item.id ? (
                    <div className="flex-1 flex items-center space-x-1">
                      <input
                        type="text"
                        value={editingTodoItem.text}
                        onChange={(e) => onSaveTodoItemEdit(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onSaveTodoItemEdit(editingTodoItem.text);
                          } else if (e.key === 'Escape') {
                            onCancelTodoItemEdit();
                          }
                        }}
                        onBlur={() => onSaveTodoItemEdit(editingTodoItem.text)}
                        className="flex-1 text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                        autoFocus
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveTodoItemEdit(editingTodoItem.text);
                        }}
                        className="text-green-600 hover:text-green-800 text-xs"
                        title="Uložit"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelTodoItemEdit();
                        }}
                        className="text-red-600 hover:text-red-800 text-xs"
                        title="Zrušit"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between">
                      <span 
                        className={`${item.completed ? 'line-through text-gray-400' : ''} cursor-pointer hover:text-indigo-600`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartEditTodoItem(note.id, item.id, item.text);
                        }}
                        title="Klikněte pro úpravu"
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTodoItem(note.id, item.id);
                        }}
                        className="p-1 text-red-500 hover:text-red-700 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Smazat úkol"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </li>
              ))}
              {(note as TodoNote).items.length > 3 && (
                <li className="text-xs text-gray-400">
                  +{(note as TodoNote).items.length - 3} dalších úkolů
                </li>
              )}
            </ul>
            <li className="pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddTodoItem(note.id);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                title="Přidat nový úkol"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Přidat úkol
              </button>
            </li>
          </div>
        )}
        
        {note.type === 'image' && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={(note as ImageNote).imageUrl} 
              alt={(note as ImageNote).caption || 'Obrázek'} 
              className="w-full h-full object-cover"
            />
            {(note as ImageNote).caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                {(note as ImageNote).caption}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metadata poznámky */}
      <div className="mt-4 text-xs text-gray-400">
        Vytvořeno: {new Date(note.createdAt).toLocaleDateString('cs-CZ')}
      </div>
      
      {/* Kategorie */}
      {note.color && (
        <div className="mt-2 flex items-center">
          {categories.find(cat => cat.id === note.color) && (
            <>
              <div className={`w-3 h-3 rounded-full bg-${categories.find(cat => cat.id === note.color)?.color}-500 mr-2`} />
              <span className="text-xs text-gray-500">
                {categories.find(cat => cat.id === note.color)?.name}
              </span>
            </>
          )}
        </div>
      )}
      
      {/* Lokace */}
      {(note as any).location && (
        <div className="mt-2 flex items-center">
          <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-xs text-gray-400">
            {(note as any).location.lat.toFixed(4)}, {(note as any).location.lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
} 