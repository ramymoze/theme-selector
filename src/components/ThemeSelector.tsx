'use client';

import { useState, useEffect } from 'react';
import { themes, categories } from '@/data/themes';
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

export default function ThemeSelector() {
  const [group, setGroup] = useState<1 | 2>(1);
  const [miniGroupSize, setMiniGroupSize] = useState<number>(1);
  const [members, setMembers] = useState<Member[]>([{ name: '' }]);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSubmissions();
    const channel = supabase
      .channel('public:submissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
        loadSubmissions();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadSubmissions = async () => {
    const { data } = await supabase.from('submissions').select('*');
    if (data) setSubmissions(data as Submission[]);
  };

  useEffect(() => {
    const newMembers = Array.from({ length: miniGroupSize }, (_, i) => members[i] || { name: '' });
    setMembers(newMembers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [miniGroupSize]);

  const takenThemes = submissions.map(sub => sub.theme_id);

  const isThemeAvailable = (themeId: string) => !takenThemes.includes(themeId);

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index].name = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!selectedTheme) {
      setError('Please select a theme before submitting.');
      setIsSubmitting(false);
      return;
    }

    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) {
        setError(`Please enter a name for Member ${i + 1}.`);
        setIsSubmitting(false);
        return;
      }
    }

    const { data: currentSubmissions } = await supabase.from('submissions').select('*');
    const takenThemes = (currentSubmissions as Submission[])?.map(sub => sub.theme_id) || [];

    if (takenThemes.includes(selectedTheme)) {
      setError(`This theme was just taken by another team. Please choose a different one.`);
      setIsSubmitting(false);
      loadSubmissions();
      return;
    }

    const { error: insertError } = await supabase.from('submissions').insert([{
      group_number: group,
      mini_group_size: miniGroupSize,
      members,
      theme_id: selectedTheme,
    }]);

    if (insertError) {
      setError('Submission failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setMembers(Array.from({ length: miniGroupSize }, () => ({ name: '' })));
    setSelectedTheme('');
    setSuccess('Theme submitted successfully!');
    setIsSubmitting(false);
    loadSubmissions();
    setTimeout(() => setSuccess(''), 5000);
  };

  const getThemesByCategory = (category: string) => themes.filter(t => t.category === category);
  const selectedThemeObj = themes.find(t => t.id === selectedTheme);

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>

      {/* ── Header ── */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '520px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.3rem 0.75rem',
          background: 'rgba(124,95,255,0.1)',
          border: '1px solid rgba(124,95,255,0.25)',
          borderRadius: '99px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#a78bfa',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c5fff', display: 'inline-block' }} />
          Advanced Network Project
        </div>
        <h1 className="page-title">Theme Selection</h1>
        <p className="page-subtitle" style={{ marginTop: '0.625rem' }}>
          Pick your group, enter your team members
        </p>
      </div>

      {/* ── Form Card ── */}
      <div className="card fade-up fade-up-delay-1" style={{ width: '100%', maxWidth: '540px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Group */}
          <div>
            <label className="form-label">Group</label>
            <div className="toggle-group">
              {([1, 2] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={`toggle-btn${group === g ? ' active' : ''}`}
                >
                  Group {g}
                </button>
              ))}
            </div>
          </div>

          <div className="section-divider" />

          {/* Team Size */}
          <div>
            <label className="form-label">Team Size</label>
            <div className="toggle-group">
              {[1, 2].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setMiniGroupSize(size)}
                  className={`toggle-btn${miniGroupSize === size ? ' active' : ''}`}
                >
                  {size} {size === 1 ? 'Member' : 'Members'}
                </button>
              ))}
            </div>
          </div>

          <div className="section-divider" />

          {/* Members */}
          <div>
            <label className="form-label">Team Members</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {members.map((member, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="member-index">{index + 1}</div>
                  <input
                    type="text"
                    placeholder={`Member ${index + 1} — Full Name`}
                    value={member.name}
                    onChange={e => handleMemberChange(index, e.target.value)}
                    className="input-field"
                    autoComplete="off"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="section-divider" />

          {/* Theme */}
          <div>
            <label className="form-label">Theme</label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedTheme}
                onChange={e => setSelectedTheme(e.target.value)}
                className="select-field"
                style={{ paddingRight: '2.5rem', cursor: 'pointer' }}
              >
                <option value="">Choose a theme…</option>
                {categories.map(category => {
                  const categoryThemes = getThemesByCategory(category);
                  return (
                    <optgroup key={category} label={category}>
                      {categoryThemes.map(theme => {
                        const available = isThemeAvailable(theme.id);
                        return (
                          <option key={theme.id} value={theme.id} disabled={!available}>
                            {available ? theme.name : `${theme.name} — Taken`}
                          </option>
                        );
                      })}
                    </optgroup>
                  );
                })}
              </select>
              {/* Custom dropdown arrow */}
              <span style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
              </span>
            </div>

            {selectedThemeObj && (
              <div className="theme-preview">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <p className="theme-preview-name">{selectedThemeObj.name}</p>
                  <span className="badge">{selectedThemeObj.category}</span>
                </div>
                <p className="theme-preview-desc" style={{ marginTop: '0.375rem' }}>
                  {selectedThemeObj.description}
                </p>
              </div>
            )}
          </div>

          {/* Error / Success */}
          {error && (
            <div className="alert alert-error">
              <span style={{ flexShrink: 0 }}>
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
              </span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <span style={{ flexShrink: 0 }}>
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>{success}</span>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? (
              <>
                <div className="spinner" />
                <span>Submitting…</span>
              </>
            ) : (
              <span>Submit Selection</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer note */}
      <p className="fade-up fade-up-delay-2" style={{
        marginTop: '1.5rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        Themes are globally exclusive across all groups
      </p>
    </div>
  );
}
