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
    // Check authentication
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin');
      return;
    }

    // Load submissions
    loadSubmissions();
    
    // Subscribe to changes
    const channel = supabase
      .channel('public:submissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
        loadSubmissions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const loadSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setSubmissions(data as Submission[]);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    // Clear cookie
    document.cookie = "admin_auth=; path=/; max-age=0; SameSite=Strict";
    sessionStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  const downloadCSV = () => {
    // Prepare CSV headers
    const headers = ['Group', 'Names', 'Theme'];
    
    // Prepare CSV rows
    const rows = filteredSubmissions.map(sub => {
      // Use comma for separating names since we'll use semicolon for CSV delimiter
      const memberNames = sub.members.map(m => m.name).join(', ');
      
      return [
        `Group ${sub.group_number}`,
        memberNames,
        getThemeName(sub.theme_id)
      ];
    });
    
    // Combine headers and rows with semicolon delimiter (better for Excel in many regions)
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');
    
    // Create blob with BOM for Excel and download
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

  const getThemeName = (themeId: string) => {
    return themes.find(t => t.id === themeId)?.name || themeId;
  };

  const getThemeCategory = (themeId: string) => {
    return themes.find(t => t.id === themeId)?.category || '';
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesGroup = filter === 'all' || sub.group_number === filter;
    const matchesSearch = searchTerm === '' || 
      sub.members.some(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      getThemeName(sub.theme_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesGroup && matchesSearch;
  });

  // Statistics
  const group1Count = submissions.filter(s => s.group_number === 1).length;
  const group2Count = submissions.filter(s => s.group_number === 2).length;
  const uniqueThemes = new Set(submissions.map(s => s.theme_id)).size;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="spinner border-slate-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              Admin Dashboard
            </h1>
            <p className="text-slate-500">
              Monitor theme selections
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadCSV} 
              className="btn-primary text-sm"
              disabled={filteredSubmissions.length === 0}
            >
              📥 Download CSV
            </button>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 slide-in">
          <div className="card border-l-4 border-l-blue-600">
            <div className="text-sm text-slate-500 font-medium mb-1">Total Submissions</div>
            <div className="text-3xl font-bold text-slate-900">{submissions.length}</div>
          </div>
          
          <div className="card border-l-4 border-l-indigo-600">
            <div className="text-sm text-slate-500 font-medium mb-1">Group 1 Teams</div>
            <div className="text-3xl font-bold text-slate-900">{group1Count}</div>
          </div>
          
          <div className="card border-l-4 border-l-pink-600">
            <div className="text-sm text-slate-500 font-medium mb-1">Group 2 Teams</div>
            <div className="text-3xl font-bold text-slate-900">{group2Count}</div>
          </div>
          
          <div className="card border-l-4 border-l-emerald-600">
            <div className="text-sm text-slate-500 font-medium mb-1">Unique Themes</div>
            <div className="text-3xl font-bold text-slate-900">{uniqueThemes}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                Filter by Group
              </label>
              <div className="toggle-group">
                <button
                  onClick={() => setFilter('all')}
                  className={`toggle-btn ${filter === 'all' ? 'active' : ''}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter(1)}
                  className={`toggle-btn ${filter === 1 ? 'active' : ''}`}
                >
                  Group 1
                </button>
                <button
                  onClick={() => setFilter(2)}
                  className={`toggle-btn ${filter === 2 ? 'active' : ''}`}
                >
                  Group 2
                </button>
              </div>
            </div>
            <div>
              <label className="form-label">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or theme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Submissions
            </h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {filteredSubmissions.length} Results
            </span>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-slate-400">No submissions found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredSubmissions.map((sub) => (
                <div key={sub.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`badge ${
                          sub.group_number === 1 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          Group {sub.group_number}
                        </span>
                        <span className="text-sm text-slate-500">
                          {new Date(sub.created_at).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {getThemeName(sub.theme_id)}
                      </h3>
                      <p className="text-sm text-slate-500 mb-3">
                        {getThemeCategory(sub.theme_id)}
                      </p>

                      <div className="bg-slate-50 rounded p-3">
                        <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Team Members</div>
                        <div className="flex flex-wrap gap-2">
                          {sub.members.map((member, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium bg-white text-slate-700">
                              {member.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
