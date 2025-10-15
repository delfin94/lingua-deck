import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://skzugdjvrrwoboexhavg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrenVnZGp2cnJ3b2JvZXhoYXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzcwNzgsImV4cCI6MjA3NDkxMzA3OH0.LDF7p1_tVieO0z5262SMCa_wtWKkhrOz1wIOKd-tCoA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
