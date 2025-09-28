import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// client רגיל - לשימוש ב-Frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// client עם הרשאות מלאות - לשימוש ב-API Routes בלבד
export const supabaseServer = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)
