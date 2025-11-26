import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://abokmoidtsvxisofrkin.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFib2ttb2lkdHN2eGlzb2Zya2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Mzg5MTYsImV4cCI6MjA3OTExNDkxNn0.UeLlOuzS0BcIGQryvGgIqd-mDxX_K7--cc5v1cSVS0o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
