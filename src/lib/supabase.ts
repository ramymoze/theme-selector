import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ggkvocimcrbpmwahbvvk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdna3ZvY2ltY3JicG13YWhidnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDU4MTUsImV4cCI6MjA4MDE4MTgxNX0.AEsk79p5-DkDNH-5yMLLOMVZrgev9BI2u04sVLTI2Vg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
