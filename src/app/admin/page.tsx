'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_PASSWORD = 'F9x!Q2p@Lw7ZR4v#N8m$Tq3KH6d%S1r^Jc8BP7k&V3a*Xy5M';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      // Set cookie for middleware
      document.cookie = "admin_auth=true; path=/; max-age=86400; SameSite=Strict";
      sessionStorage.setItem('adminAuth', 'true'); // Keep for client-side redundancy
      router.push('/admin/dashboard');
    } else {
      setError('Incorrect password');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="card fade-in bg-white shadow-lg border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Admin Access
            </h1>
            <p className="text-slate-500 text-sm">
              Enter your password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="input-field"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="error-message text-sm py-2 px-3">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner border-white/30 border-t-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>

            <div className="text-center">
              <a 
                href="/" 
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                ← Back to Theme Selection
              </a>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Default password: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-600">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
