import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mznrzaoakypgxuvskisg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bnJ6YW9ha3lwZ3h1dnNraXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NDU4ODcsImV4cCI6MjA3NDAyMTg4N30.DjvgH46OxfcgqRTEof4aT7HUqeEAGnNApTpVHjstUDA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
