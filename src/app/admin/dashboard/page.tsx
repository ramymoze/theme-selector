'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { themes } from '@/data/themes';
import { supabase } from '@/lib/supabase';

interface Member {
  name: string;
}

interface Submission {
  id: string;
  group_number: 1 | 2;
  mini_group_size: number;
  members: Member[];
  theme_id: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<'all' | 1 | 2>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin');
      return;
    }

    loadSubmissions();
    
    const channel = supabase
      .channel('public:submissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
        loadSubmissions();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [router]);

  const loadSubmissions = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setSubmissions(data as Submission[]);
    setIsLoading(false);
  };

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; max-age=0; SameSite=Strict";
    sessionStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  const downloadCSV = () => {
    const headers = ['Group', 'Names', 'Theme'];
    const rows = filteredSubmissions.map(sub => {
      const memberNames = sub.members.map(m => m.name).join(', ');
      return [`Group ${sub.group_number}`, memberNames, getThemeName(sub.theme_id)];
    });
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getThemeName = (themeId: string) => themes.find(t => t.id === themeId)?.name || themeId;
  const getThemeCategory = (themeId: string) => themes.find(t => t.id === themeId)?.category || '';

  const filteredSubmissions = submissions.filter(sub => {
    const matchesGroup = filter === 'all' || sub.group_number === filter;
    const matchesSearch = searchTerm === '' || 
      sub.members.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      getThemeName(sub.theme_id).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const group1Count = submissions.filter(s => s.group_number === 1).length;
  const group2Count = submissions.filter(s => s.group_number === 2).length;
  const uniqueThemes = new Set(submissions.map(s => s.theme_id)).size;

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '2rem', height: '2rem' }}></div>
          <p className="page-subtitle">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up" style={{ minHeight: '100vh', padding: '4rem 2rem', position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', marginBottom: '3rem' }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle" style={{ marginTop: '0.5rem' }}>
            Monitor and export group theme selections.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={downloadCSV} 
            className="btn-primary"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={filteredSubmissions.length === 0}
          >
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download CSV
          </button>
          <button onClick={handleLogout} className="btn-admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── Filter & Search ── */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <label className="form-label">Filter by Group</label>
            <div className="toggle-group text-sm">
              <button onClick={() => setFilter('all')} className={`toggle-btn ${filter === 'all' ? 'active' : ''}`}>All</button>
              <button onClick={() => setFilter(1)} className={`toggle-btn ${filter === 1 ? 'active' : ''}`}>Group 1</button>
              <button onClick={() => setFilter(2)} className={`toggle-btn ${filter === 2 ? 'active' : ''}`}>Group 2</button>
            </div>
          </div>
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search by name or theme…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* ── Submissions List ── */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Submissions</h2>
          <span className="badge" style={{ marginTop: 0 }}>
            {filteredSubmissions.length} Results
          </span>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px dashed var(--border-hi)', borderRadius: 'var(--radius-lg)' }}>
            <p className="page-subtitle">No submissions found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredSubmissions.map((sub) => (
              <div key={sub.id} style={{ padding: '1.5rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <span className="badge" style={{ margin: 0 }}>Group {sub.group_number}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                        {new Date(sub.created_at).toLocaleString()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                      {getThemeName(sub.theme_id)}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {getThemeCategory(sub.theme_id)}
                    </p>
                  </div>
                </div>

                <div className="section-divider" style={{ margin: '1rem 0' }} />

                <div>
                  <div className="form-label" style={{ marginBottom: '0.75rem' }}>Team Members</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {sub.members.map((member, idx) => (
                      <span key={idx} style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        padding: '0.35rem 0.8rem', 
                        borderRadius: '99px', 
                        fontSize: '0.85rem', 
                        fontWeight: 500, 
                        background: 'var(--surface-3)', 
                        border: '1px solid var(--border)' 
                      }}>
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
