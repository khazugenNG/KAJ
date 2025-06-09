import { useState, useEffect } from 'react';
import type { Note } from '../types/Note';

interface NoteStats {
  total: number;
  byType: {
    text: number;
    todo: number;
    image: number;
  };
  byCategory: {
    [key: string]: number;
  };
  byMonth: {
    [key: string]: number;
  };
  completedTodos: number;
  totalTodos: number;
}

interface StatsPageProps {
  notes?: Note[];
  archivedNotes?: Note[];
}

function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function StatsPage({ notes = [], archivedNotes = [] }: StatsPageProps) {
  const [stats, setStats] = useState<NoteStats>({
    total: 0,
    byType: { text: 0, todo: 0, image: 0 },
    byCategory: {},
    byMonth: {},
    completedTodos: 0,
    totalTodos: 0
  });

  // Kategorie pro mapování
  const categories = [
    { id: '1', name: 'Práce', color: 'indigo' },
    { id: '2', name: 'Osobní', color: 'purple' },
    { id: '3', name: 'Studium', color: 'pink' },
    { id: '4', name: 'Nákupy', color: 'green' },
    { id: '5', name: 'Zdraví', color: 'red' },
  ];

  useEffect(() => {
    const allNotes = [...notes, ...archivedNotes];
    
    // Počítání podle typu
    const byType = { text: 0, todo: 0, image: 0 };
    let completedTodos = 0;
    let totalTodos = 0;

    allNotes.forEach(note => {
      byType[note.type]++;
      
      if (note.type === 'todo') {
        totalTodos += (note as any).items?.length || 0;
        completedTodos += (note as any).items?.filter((item: any) => item.completed).length || 0;
      }
    });

    // Počítání podle kategorie
    const byCategory: { [key: string]: number } = {};
    allNotes.forEach(note => {
      if (note.color) {
        const categoryName = categories.find(cat => cat.id === note.color)?.name || note.color;
        byCategory[categoryName] = (byCategory[categoryName] || 0) + 1;
      }
    });

    // Počítání podle měsíce
    const byMonth: { [key: string]: number } = {};
    allNotes.forEach(note => {
      const monthKey = new Date(note.createdAt).toISOString().slice(0, 7); // YYYY-MM
      byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
    });

    setStats({
      total: allNotes.length,
      byType,
      byCategory,
      byMonth,
      completedTodos,
      totalTodos
    });
  }, [notes, archivedNotes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistiky poznámek</h2>
        
        {/* Celkový počet */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Celkový počet poznámek</h3>
          <div className="text-4xl font-bold text-indigo-600">{stats.total}</div>
        </div>

        {/* Statistiky úkolů */}
        {stats.totalTodos > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiky úkolů</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Splněné úkoly</p>
                    <p className="text-2xl font-bold text-green-900">{stats.completedTodos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Celkem úkolů</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalTodos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Úspěšnost</p>
                    <p className="text-2xl font-bold text-purple-900">{calculatePercentage(stats.completedTodos, stats.totalTodos)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rozdělení podle typu */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rozdělení podle typu</h3>
          <div className="space-y-4">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                  <span className="text-sm text-gray-500">{count} poznámek</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calculatePercentage(count, stats.total)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rozdělení podle kategorie */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rozdělení podle kategorie</h3>
          <div className="space-y-4">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm text-gray-500">{count} poznámek</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calculatePercentage(count, Math.max(...Object.values(stats.byCategory)))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rozdělení podle měsíce */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rozdělení podle měsíce</h3>
          <div className="space-y-4">
            {Object.entries(stats.byMonth).map(([month, count]) => (
              <div key={month} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(month).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-sm text-gray-500">{count} poznámek</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calculatePercentage(count, Math.max(...Object.values(stats.byMonth)))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 