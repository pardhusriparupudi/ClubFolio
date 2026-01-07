import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gsdrkgbgcyifetgzymjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzZHJrZ2JnY3lpZmV0Z3p5bWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3ODgzMzYsImV4cCI6MjA4MzM2NDMzNn0.DtlkO1jGcOX7s7AzEGaqtqHPP3WArnefV2HxWMIG_tY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
