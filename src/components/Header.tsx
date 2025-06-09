/**
 * Komponenta pro responzivní header s navigací
 * 
 * Obsahuje:
 * - Logo aplikace
 * - Desktop navigaci
 * - Mobilní hamburger menu
 * - Uživatelské informace
 * - Online status indikátor
 * 
 * @author Mike
 * @version 1.0.0
 */

interface HeaderProps {
  currentPage: 'notes' | 'profile' | 'categories' | 'share' | 'archive' | 'stats';
  realTimeStatus: string;
  username: string;
  isMobileMenuOpen: boolean;
  onPageChange: (page: 'notes' | 'profile' | 'categories' | 'share' | 'archive' | 'stats') => void;
  onLogout: () => void;
  onMobileMenuToggle: () => void;
}

/**
 * Komponenta headeru s responzivní navigací
 * Poskytuje desktop i mobilní navigaci s hamburger menu
 */
export function Header({
  currentPage,
  realTimeStatus,
  username,
  isMobileMenuOpen,
  onPageChange,
  onLogout,
  onMobileMenuToggle
}: HeaderProps) {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-md py-2 px-0 sticky top-0 z-10 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">
        {/* Logo vlevo */}
        <div className="flex-shrink-0 flex items-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
            KajNotes
          </h1>
        </div>

        {/* Desktop menu - skryté na mobilu */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex space-x-8">
            <button
              onClick={() => onPageChange('notes')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                currentPage === 'notes'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Poznámky
            </button>
            <button 
              onClick={() => onPageChange('categories')} 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                currentPage === 'categories' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Kategorie
            </button>
            <button 
              onClick={() => onPageChange('share')} 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                currentPage === 'share' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Sdílení
            </button>
            <button 
              onClick={() => onPageChange('archive')} 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                currentPage === 'archive' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Archiv
            </button>
            <button 
              onClick={() => onPageChange('stats')} 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                currentPage === 'stats' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Statistiky
            </button>
          </div>
        </div>

        {/* Desktop uživatelská sekce - skrytá na mobilu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              realTimeStatus === 'online' ? 'bg-green-500' : 
              realTimeStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <span className="text-xs text-gray-500">
              {realTimeStatus === 'online' ? 'Online' : 
               realTimeStatus === 'error' ? 'Chyba' : 'Offline'}
            </span>
          </div>
          <span className="text-gray-700 font-semibold">{username}</span>
          <button 
            onClick={onLogout} 
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
          >
            Odhlásit se
          </button>
        </div>

        {/* Mobilní hamburger menu */}
        <div className="md:hidden flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              realTimeStatus === 'online' ? 'bg-green-500' : 
              realTimeStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <span className="text-xs text-gray-500 hidden sm:inline">
              {realTimeStatus === 'online' ? 'Online' : 
               realTimeStatus === 'error' ? 'Chyba' : 'Offline'}
            </span>
          </div>
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Otevřít menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobilní menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {/* Navigační položky */}
            <button
              onClick={() => {
                onPageChange('notes');
                onMobileMenuToggle();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === 'notes'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Poznámky
              </div>
            </button>
            <button
              onClick={() => {
                onPageChange('categories');
                onMobileMenuToggle();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === 'categories'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Kategorie
            </button>
            <button
              onClick={() => {
                onPageChange('share');
                onMobileMenuToggle();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === 'share'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sdílení
            </button>
            <button
              onClick={() => {
                onPageChange('archive');
                onMobileMenuToggle();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === 'archive'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Archiv
            </button>
            <button
              onClick={() => {
                onPageChange('stats');
                onMobileMenuToggle();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === 'stats'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Statistiky
            </button>
            
            {/* Oddělovač */}
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Uživatelské informace */}
            <div className="px-3 py-2">
              <div className="text-sm text-gray-500">Přihlášen jako</div>
              <div className="text-sm font-semibold text-gray-700">{username}</div>
            </div>
            
            {/* Odhlášení */}
            <button
              onClick={() => {
                onLogout();
                onMobileMenuToggle();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 