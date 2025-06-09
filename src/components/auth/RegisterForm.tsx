import { useState } from 'react';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Hesla se neshodují');
      return;
    }

    setIsLoading(true);
    try {
      await onRegister(username, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Něco se pokazilo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Uživatelské jméno
          </label>
          <div className="mt-1 relative">
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm placeholder-gray-400 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="jmeno"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 relative">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm placeholder-gray-400 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="vas@email.cz"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Heslo
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm placeholder-gray-400 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Minimálně 8 znaků, včetně velkého písmene, malého písmene a čísla
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Potvrzení hesla
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm placeholder-gray-400 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white 
            bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
            transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            shadow-lg shadow-indigo-500/25"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrace...
            </span>
          ) : (
            'Registrovat se'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 
            transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Již máte účet? Přihlaste se
        </button>
      </div>
    </form>
  );
} 