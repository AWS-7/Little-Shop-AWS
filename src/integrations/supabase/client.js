// Supabase client configuration for Little Shop
import { createClient } from '@supabase/supabase-js';

// Your Supabase project credentials
const SUPABASE_URL = 'https://wcyipsuqpizhropaocza.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeWlwc3VxcGl6aHJvcGFvY3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NTAxMjAsImV4cCI6MjA5MTUyNjEyMH0.KE6PcwXnaUkRTCLhpqlH_Tqj0bEYtrcAcTVVql7wA6o';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
