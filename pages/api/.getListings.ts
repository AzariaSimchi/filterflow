import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('id', { ascending: false }) // יציג את החדשים ראשונים

    if (error) {
      console.error('Supabase select error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ listings: data })
  } catch (err) {
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
