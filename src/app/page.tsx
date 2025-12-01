import ThemeSelector from '@/components/ThemeSelector';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="fixed bottom-6 right-6 z-50">
        <Link 
          href="/admin" 
          className="btn-secondary flex items-center gap-2 shadow-lg bg-white"
        >
          <span>🔐</span>
          Admin
        </Link>
      </div>
      <ThemeSelector />
    </main>
  );
}
