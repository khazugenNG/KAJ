import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NoteFlow
          </h1>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Přihlaste se do svého účtu' : 'Vytvořte si nový účet'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {isLogin ? (
            <LoginForm
              onLogin={onLogin}
              onSwitchToRegister={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onRegister={onRegister}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 NoteFlow. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </div>
  );
} 