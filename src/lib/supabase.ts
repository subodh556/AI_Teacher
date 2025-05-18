import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

/**
 * Creates a Supabase client with the provided URL and API key.
 * 
 * @param {string} supabaseUrl - The URL of your Supabase project
 * @param {string} supabaseKey - The API key for your Supabase project
 * @returns The Supabase client instance
 */
const createSupabaseClient = (
  supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
) => {
  return createClient<Database>(supabaseUrl, supabaseKey);
};

/**
 * Singleton instance of the Supabase client for browser usage.
 * This should be used for client-side operations.
 */
export const supabase = createSupabaseClient();

/**
 * Creates a Supabase admin client with service role permissions.
 * This should only be used in server-side contexts where elevated permissions are needed.
 * 
 * @returns The Supabase admin client instance
 */
export const createSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or Service Role Key is missing');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
};

export default supabase;
