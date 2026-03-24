import ThemeSelector from '@/components/ThemeSelector';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50 }}>
        <Link href="/admin" className="btn-admin">
          <span>
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', marginBottom: '1px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </span>
          Admin
        </Link>
      </div>
      <ThemeSelector />
    </main>
  );
}
