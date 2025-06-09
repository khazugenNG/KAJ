/**
 * Komponenta pro editaci poznámek
 * 
 * Obsahuje:
 * - Modal pro editaci všech typů poznámek
 * - Formuláře pro text, todo a obrázkové poznámky
 * - Validaci a ukládání změn
 * 
 * @author Mike
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import type { Note, TextNote, TodoNote, ImageNote, TodoItem } from '../types/Note';

interface NoteEditModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedNote: Note) => void;
  categories: Array<{ id: string; name: string; color: string }>;
}

/**
 * Komponenta modalu pro editaci poznámek
 * Umožňuje editaci všech typů poznámek v jednom rozhraní
 */
export function NoteEditModal({
  note,
  isOpen,
  onClose,
  onSave,
  categories
}: NoteEditModalProps) {
  // ===== STATE PRO EDITACI =====
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [completed, setCompleted] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');

  // ===== USE EFFECT PRO NAČTENÍ DAT =====
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setSelectedCategory(note.color || '');
      setCompleted(note.completed);
      
      if (note.type === 'text') {
        setContent((note as TextNote).content);
      } else if (note.type === 'todo') {
        setTodoItems([...(note as TodoNote).items]);
      } else if (note.type === 'image') {
        setImageUrl((note as ImageNote).imageUrl);
        setImageCaption((note as ImageNote).caption || '');
      }
    }
  }, [note]);

  // ===== FUNKCE PRO SPRÁVU TODO POLOŽEK =====
  const addTodoItem = () => {
    if (newTodoText.trim()) {
      setTodoItems(prev => [...prev, {
        id: Date.now().toString() + Math.random(),
        text: newTodoText.trim(),
        completed: false
      }]);
      setNewTodoText('');
    }
  };

  const updateTodoItem = (id: string, text: string) => {
    setTodoItems(prev => prev.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const toggleTodoItem = (id: string) => {
    setTodoItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteTodoItem = (id: string) => {
    setTodoItems(prev => prev.filter(item => item.id !== id));
  };

  // ===== FUNKCE PRO SPRÁVU OBRÁZKŮ =====
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ===== FUNKCE PRO ULOŽENÍ =====
  const handleSave = () => {
    if (!note || !title.trim()) return;

    const updatedNote: Note = {
      ...note,
      title: title.trim(),
      color: selectedCategory || undefined,
      completed,
      updatedAt: new Date()
    };

    if (note.type === 'text') {
      (updatedNote as TextNote).content = content;
    } else if (note.type === 'todo') {
      (updatedNote as TodoNote).items = todoItems;
    } else if (note.type === 'image') {
      (updatedNote as ImageNote).imageUrl = imageUrl;
      (updatedNote as ImageNote).caption = imageCaption || undefined;
    }

    onSave(updatedNote);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // ===== RENDER =====
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Upravit poznámku
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Obsah */}
        <div className="p-6 space-y-6">
          {/* Základní informace */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Název poznámky *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Zadejte název poznámky"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="completed"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="completed" className="ml-2 text-sm text-gray-700">
                  Označit jako dokončené
                </label>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Bez kategorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Obsah podle typu poznámky */}
          {note.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obsah poznámky
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                placeholder="Zadejte obsah poznámky..."
              />
            </div>
          )}

          {note.type === 'todo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seznam úkolů
              </label>
              <div className="space-y-2">
                {todoItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => toggleTodoItem(item.id)}
                      className={`w-4 h-4 rounded-full flex-shrink-0 transition-all duration-200 ${
                        item.completed 
                          ? 'bg-green-500 border-2 border-green-500' 
                          : 'border-2 border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateTodoItem(item.id, e.target.value)}
                      className={`flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        item.completed ? 'line-through text-gray-400' : ''
                      }`}
                    />
                    <button
                      onClick={() => deleteTodoItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Smazat úkol"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTodoItem()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Přidat nový úkol..."
                  />
                  <button
                    onClick={addTodoItem}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Přidat
                  </button>
                </div>
              </div>
            </div>
          )}

          {note.type === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Obrázek
                </label>
                {imageUrl ? (
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt="Náhled" 
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Odstranit obrázek"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600">Klikněte pro nahrání obrázku</p>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popisek obrázku
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Zadejte popisek obrázku..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer s tlačítky */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Uložit změny
          </button>
        </div>
      </div>
    </div>
  );
} 