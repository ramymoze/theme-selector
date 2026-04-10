'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

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
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      
      <div className="card fade-up" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: '1rem',
            background: 'rgba(124,95,255,0.1)',
            border: '1px solid rgba(124,95,255,0.25)',
            marginBottom: '1.25rem',
            color: 'var(--violet)'
          }}>
            <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1 className="page-title" style={{ fontSize: '1.8rem' }}>Admin Access</h1>
          <p className="page-subtitle" style={{ marginTop: '0.5rem' }}>
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="form-label">Password</label>
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
            <div className="alert alert-error">
              <span style={{ flexShrink: 0 }}>
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
              </span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary"
            style={{ marginTop: '0.5rem' }}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Verifying…</span>
              </>
            ) : (
              <span>Secure Login</span>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button 
              type="button"
              onClick={() => router.push('/')}
              className="btn-admin"
              style={{ background: 'transparent', border: 'none', padding: 0 }}
            >
              ← Back to Theme Selection
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
