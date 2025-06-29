/**
 * Komponenta pro vytváření nových poznámek
 * 
 * Obsahuje:
 * - Výběr typu poznámky (text, todo, image)
 * - Formulářová pole podle typu
 * - Validaci a zpracování dat
 * 
 * @author Mike
 * @version 1.0.0
 */

import React from 'react';

interface NoteFormProps {
  isCreating: boolean;
  newNoteType: 'text' | 'todo' | 'image';
  newNoteTitle: string;
  newNoteContent: string;
  newTodoItems: Array<{ id: string; text: string; completed: boolean }>;
  newImage: string | null;
  newImageCaption: string;
  selectedCategory: string;
  categories: Array<{ id: string; name: string; color: string }>;
  onTypeChange: (type: 'text' | 'todo' | 'image') => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onTodoItemsChange: (items: Array<{ id: string; text: string; completed: boolean }>) => void;
  onImageChange: (image: string | null) => void;
  onImageCaptionChange: (caption: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Komponenta formuláře pro vytváření poznámek
 * Poskytuje rozhraní pro vytvoření různých typů poznámek
 */
export function NoteForm({
  isCreating,
  newNoteType,
  newNoteTitle,
  newNoteContent,
  newTodoItems,
  newImage,
  newImageCaption,
  selectedCategory,
  categories,
  onTypeChange,
  onTitleChange,
  onContentChange,
  onTodoItemsChange,
  onImageChange,
  onImageCaptionChange,
  onCategoryChange,
  onSubmit,
  onCancel
}: NoteFormProps) {
  if (!isCreating) return null;

  const handleTodoItemChange = (index: number, field: 'text' | 'completed', value: string | boolean) => {
    const updatedItems = [...newTodoItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onTodoItemsChange(updatedItems);
  };

  const addTodoItem = () => {
    onTodoItemsChange([...newTodoItems, { id: Date.now().toString(), text: '', completed: false }]);
  };

  const removeTodoItem = (index: number) => {
    const updatedItems = newTodoItems.filter((_, i) => i !== index);
    onTodoItemsChange(updatedItems);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Nová poznámka</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            {/* Výběr typu poznámky */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Typ poznámky
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'text' as const, label: 'Text', icon: '📝' },
                  { type: 'todo' as const, label: 'Todo', icon: '✅' },
                  { type: 'image' as const, label: 'Obrázek', icon: '🖼️' }
                ].map(({ type, label, icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onTypeChange(type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      newNoteType === type
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="text-sm font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Název poznámky */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Název poznámky *
              </label>
              <input
                type="text"
                id="title"
                value={newNoteTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Zadejte název poznámky"
                required
              />
            </div>

            {/* Kategorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Bez kategorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Obsah podle typu */}
            {newNoteType === 'text' && (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Obsah poznámky
                </label>
                <textarea
                  id="content"
                  value={newNoteContent}
                  onChange={(e) => onContentChange(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Zadejte obsah poznámky..."
                />
              </div>
            )}

            {newNoteType === 'todo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Úkoly
                </label>
                <div className="space-y-2">
                  {newTodoItems.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => handleTodoItemChange(index, 'completed', e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleTodoItemChange(index, 'text', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Zadejte úkol..."
                      />
                      {newTodoItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTodoItem(index)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTodoItem}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    + Přidat úkol
                  </button>
                </div>
              </div>
            )}

            {newNoteType === 'image' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nahrát obrázek
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {newImage && (
                  <div>
                    <img
                      src={newImage}
                      alt="Náhled"
                      className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                    Popisek obrázku
                  </label>
                  <textarea
                    id="caption"
                    value={newImageCaption}
                    onChange={(e) => onImageCaptionChange(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Zadejte popisek obrázku..."
                  />
                </div>
              </div>
            )}

            {/* Tlačítka */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Vytvořit poznámku
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 