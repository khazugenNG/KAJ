import { useState } from 'react';

export function SharePage() {
  const [isSharing, setIsSharing] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string>('');
  const [shareEmail, setShareEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleShareNote = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedNote) {
      setError('Vyberte poznámku ke sdílení');
      return;
    }

    if (!shareEmail.trim()) {
      setError('Zadejte email uživatele');
      return;
    }

    // TODO: Implementovat sdílení poznámky
    setSuccess('Poznámka byla úspěšně sdílena');
    setShareEmail('');
    setSelectedNote('');
    setIsSharing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Hlavička */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sdílené poznámky</h1>
          <button
            onClick={() => setIsSharing(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white 
              bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
              transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              shadow-lg shadow-indigo-500/25"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Sdílet poznámku
          </button>
        </div>

        {/* Formulář pro sdílení */}
        {isSharing && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sdílet poznámku</h2>
            <form onSubmit={handleShareNote} className="space-y-6">
              <div>
                <label htmlFor="noteSelect" className="block text-sm font-medium text-gray-700">
                  Vyberte poznámku
                </label>
                <select
                  id="noteSelect"
                  value={selectedNote}
                  onChange={(e) => setSelectedNote(e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Vyberte poznámku</option>
                  <option value="1">Důležité poznámky z přednášky</option>
                  <option value="2">Seznam úkolů pro projekt</option>
                </select>
              </div>
              <div>
                <label htmlFor="shareEmail" className="block text-sm font-medium text-gray-700">
                  Email uživatele
                </label>
                <input
                  type="email"
                  id="shareEmail"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Zadejte email uživatele"
                />
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
                  Sdílet poznámku
                </button>
                <button
                  type="button"
                  onClick={() => setIsSharing(false)}
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

        {/* Seznam sdílených poznámek */}
        <div className="space-y-6">
          {/* sharedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 
                transform transition-all duration-200 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {note.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Sdíleno {new Date(note.sharedAt).toLocaleDateString('cs-CZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {note.sharedBy === session.user.email ? 'Sdíleno vámi' : `Sdíleno od ${note.sharedBy}`}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      note.type === 'text' ? 'bg-indigo-500' :
                      note.type === 'todo' ? 'bg-purple-500' :
                      'bg-pink-500'
                    }`} />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sdíleno s:</h4>
                  <div className="space-y-2">
                    {note.sharedWith.map((email) => (
                      <div key={email} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{email}</span>
                        {note.sharedBy === session.user.email && (
                          <button
                            onClick={handleRemoveShare}
                            className="text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 
                              transition-colors duration-200 p-1"
                            title="Odebrat sdílení"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )) */}
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