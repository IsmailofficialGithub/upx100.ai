import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
}

/**
 * Service role client for administrative tasks (bypasses RLS).
 * Use only for: auth admin API, bootstrap, webhooks, GCC-global operations,
 * and code paths not yet migrated to the user-scoped client.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Dedicated client for Auth flows that create or replace an in-memory session.
 * Keeping this separate prevents a signed-in user's JWT from being used by
 * service-role database queries on supabaseAdmin.
 */
export const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Supabase client that runs queries as the **end user** (JWT in Authorization header).
 * Row Level Security policies apply. Requires SUPABASE_ANON_KEY.
 *
 * @param {import('express').Request} req - Must have `req.headers.authorization` = `Bearer <access_token>`
 * @returns {import('@supabase/supabase-js').SupabaseClient | null} null if anon key not configured
 */
export const createSupabaseForRequest = (req) => {
  if (!supabaseAnonKey) {
    return null
  }
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
