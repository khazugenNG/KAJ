import { useState, useEffect } from 'react';
import type { Note } from '../types/Note';

interface Category {
  id: string;
  name: string;
  color: string;
  noteCount: number;
}

interface CategoriesPageProps {
  notes?: Note[];
  onCategorySelect?: (categoryId: string) => void;
  onBackToNotes?: () => void;
}

export function CategoriesPage({ notes = [], onCategorySelect, onBackToNotes }: CategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Práce', color: 'indigo', noteCount: 0 },
    { id: '2', name: 'Osobní', color: 'purple', noteCount: 0 },
    { id: '3', name: 'Studium', color: 'pink', noteCount: 0 },
    { id: '4', name: 'Nákupy', color: 'green', noteCount: 0 },
    { id: '5', name: 'Zdraví', color: 'red', noteCount: 0 },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('indigo');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Počítání poznámek v kategoriích
  const updateCategoryCounts = () => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      noteCount: notes.filter(note => note.color === cat.id).length
    })));
  };

  // Aktualizace počtů při změně poznámek
  useEffect(() => {
    updateCategoryCounts();
  }, [notes]);

  const colors = [
    { name: 'indigo', bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600' },
    { name: 'purple', bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    { name: 'pink', bg: 'bg-pink-500', hover: 'hover:bg-pink-600' },
    { name: 'blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
    { name: 'green', bg: 'bg-green-500', hover: 'hover:bg-green-600' },
    { name: 'yellow', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
    { name: 'red', bg: 'bg-red-500', hover: 'hover:bg-red-600' },
    { name: 'gray', bg: 'bg-gray-500', hover: 'hover:bg-gray-600' },
  ];

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newCategoryName.trim()) {
      setError('Název kategorie nemůže být prázdný');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      setError('Kategorie s tímto názvem již existuje');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      color: selectedColor,
      noteCount: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setSelectedColor('indigo');
    setIsCreating(false);
    setSuccess('Kategorie byla úspěšně vytvořena');
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    setSuccess('Kategorie byla úspěšně smazána');
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    if (onCategorySelect) {
      onCategorySelect(category.id);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    if (onBackToNotes) {
      onBackToNotes();
    }
  };

  // Pokud je vybraná kategorie, zobraz poznámky v této kategorii
  if (selectedCategory) {
    const categoryNotes = notes.filter(note => note.color === selectedCategory.id);
    
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Hlavička s tlačítkem zpět */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCategories}
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 
                bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Zpět na kategorie
            </button>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full bg-${selectedCategory.color}-500`} />
              <h1 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h1>
            </div>
          </div>

          {/* Seznam poznámek v kategorii */}
          {categoryNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <rect x="8" y="8" width="32" height="32" rx="6" strokeWidth="3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 20h16M16 28h10" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Žádné poznámky</h3>
                <p className="text-gray-600">V této kategorii zatím nejsou žádné poznámky.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-indigo-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{note.title}</h3>
                  <div className="text-sm text-gray-600">
                    {note.type === 'text' && (
                      <p className="line-clamp-3">{note.content}</p>
                    )}
                    {note.type === 'todo' && (
                      <div>
                        <p className="mb-2">Úkoly:</p>
                        <ul className="space-y-1">
                          {(note as any).items.slice(0, 3).map((item: any, idx: number) => (
                            <li key={idx} className="flex items-center text-xs">
                              <span className={`w-2 h-2 rounded-full mr-2 ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              <span className={item.completed ? 'line-through text-gray-400' : ''}>{item.text}</span>
                            </li>
                          ))}
                          {(note as any).items.length > 3 && (
                            <li className="text-xs text-gray-500">+ {(note as any).items.length - 3} dalších</li>
                          )}
                        </ul>
                      </div>
                    )}
                    {note.type === 'image' && (
                      <div>
                        <img src={(note as any).imageUrl} alt="Náhled" className="w-full h-32 object-cover rounded-lg mb-2" />
                        {(note as any).caption && (
                          <p className="text-xs text-gray-500">{(note as any).caption}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    Vytvořeno: {new Date(note.createdAt).toLocaleDateString('cs-CZ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Hlavička */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kategorie poznámek</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white 
              bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
              transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              shadow-lg shadow-indigo-500/25"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Vytvořit kategorii
          </button>
        </div>

        {/* Formulář pro vytvoření kategorie */}
        {isCreating && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Nová kategorie</h2>
            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                  Název kategorie
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Zadejte název kategorie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barva kategorie
                </label>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-full aspect-square rounded-lg ${color.bg} ${color.hover} 
                        transform transition-all duration-200 hover:scale-110
                        ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-xl text-sm font-medium text-white 
                    bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                    transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                    shadow-lg shadow-indigo-500/25"
                >
                  Vytvořit kategorii
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-700 
                    bg-white border border-gray-300 hover:bg-gray-50 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                    transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                    shadow-sm"
                >
                  Zrušit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Seznam kategorií */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 
                transform transition-all duration-200 hover:shadow-xl hover:scale-[1.02] 
                hover:border-indigo-100 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-${category.color}-500`} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 
                      transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    title="Smazat kategorii"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  {category.noteCount} {category.noteCount === 1 ? 'poznámka' : 
                    category.noteCount >= 2 && category.noteCount <= 4 ? 'poznámky' : 'poznámek'}
                </p>
                <div className="mt-3 text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Klikněte pro zobrazení poznámek →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Zprávy o chybách a úspěchu */}
        {error && (
          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
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