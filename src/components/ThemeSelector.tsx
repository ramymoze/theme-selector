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

  // Load submissions from Supabase on mount
  useEffect(() => {
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
  }, []);

  const loadSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*');
    
    if (data) {
      setSubmissions(data as Submission[]);
    }
  };

  // Update members array when mini-group size changes
  useEffect(() => {
    const newMembers = Array.from({ length: miniGroupSize }, (_, i) => 
      members[i] || { name: '' }
    );
    setMembers(newMembers);
  }, [miniGroupSize]);

  // Get themes that are already taken by the current group
  const takenThemesByCurrentGroup = submissions
    .filter(sub => sub.group_number === group)
    .map(sub => sub.theme_id);

  // Check if a theme is available
  const isThemeAvailable = (themeId: string) => {
    return !takenThemesByCurrentGroup.includes(themeId);
  };

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

    // Validation
    if (!selectedTheme) {
      setError('Please select a theme');
      setIsSubmitting(false);
      return;
    }

    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) {
        setError(`Please enter a name for Member ${i + 1}`);
        setIsSubmitting(false);
        return;
      }
    }

    // Check availability one last time
    const { data: currentSubmissions } = await supabase
      .from('submissions')
      .select('*');
      
    const takenBySameGroup = (currentSubmissions as Submission[])
      ?.filter(sub => sub.group_number === group)
      .map(sub => sub.theme_id) || [];

    if (takenBySameGroup.includes(selectedTheme)) {
      setError(`This theme has already been taken by another team in Group ${group}`);
      setIsSubmitting(false);
      loadSubmissions(); // Refresh data
      return;
    }

    // Create submission
    const { error: insertError } = await supabase
      .from('submissions')
      .insert([
        {
          group_number: group,
          mini_group_size: miniGroupSize,
          members: members,
          theme_id: selectedTheme,
        }
      ]);

    if (insertError) {
      setError('Failed to submit. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Reset form
    setMembers(Array.from({ length: miniGroupSize }, () => ({ name: '' })));
    setSelectedTheme('');
    setSuccess('Theme successfully submitted!');
    setIsSubmitting(false);
    loadSubmissions();

    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(''), 5000);
  };

  const getThemesByCategory = (category: string) => {
    return themes.filter(t => t.category === category);
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-white">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="section-title mb-4">
            DevOps Theme Selection
          </h1>
          <p className="section-subtitle">
            Select your group, team members, and project theme.
          </p>
        </div>

        {/* Main Form */}
        <div className="card fade-in">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Group Selection */}
            <div>
              <label className="form-label">
                Select Group
              </label>
              <div className="toggle-group">
                <button
                  type="button"
                  onClick={() => setGroup(1)}
                  className={`toggle-btn ${group === 1 ? 'active' : ''}`}
                >
                  Group 1
                </button>
                <button
                  type="button"
                  onClick={() => setGroup(2)}
                  className={`toggle-btn ${group === 2 ? 'active' : ''}`}
                >
                  Group 2
                </button>
              </div>
            </div>

            {/* Mini-group Size */}
            <div>
              <label className="form-label">
                Team Size
              </label>
              <div className="toggle-group">
                {[1, 2, 3].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setMiniGroupSize(size)}
                    className={`toggle-btn ${miniGroupSize === size ? 'active' : ''}`}
                  >
                    {size} {size === 1 ? 'Member' : 'Members'}
                  </button>
                ))}
              </div>
            </div>

            {/* Member Information */}
            <div>
              <label className="form-label">
                Team Members
              </label>
              <div className="space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-500">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      placeholder={`Member ${index + 1} Full Name`}
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="form-label">
                Select Theme
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="select-field"
              >
                <option value="">Choose a theme...</option>
                {categories.map((category) => {
                  const categoryThemes = getThemesByCategory(category);
                  return (
                    <optgroup key={category} label={category}>
                      {categoryThemes.map((theme) => {
                        const available = isThemeAvailable(theme.id);
                        return (
                          <option
                            key={theme.id}
                            value={theme.id}
                            disabled={!available}
                          >
                            {theme.name}
                            {!available ? ' (Taken)' : ''}
                          </option>
                        );
                      })}
                    </optgroup>
                  );
                })}
              </select>
              {selectedTheme && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {themes.find(t => t.id === selectedTheme)?.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {themes.find(t => t.id === selectedTheme)?.description}
                  </p>
                  <div className="mt-2">
                    <span className="badge badge-accent">
                      {themes.find(t => t.id === selectedTheme)?.category}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            )}
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner border-white/30 border-t-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Selection</span>
              )}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Group 1 selections are exclusive. Group 2 can select any theme.</p>
        </div>
      </div>
    </div>
  );
}
