import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabaseServer
      .from('listings')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Supabase error:', error.message)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ data })
  } catch (err: any) {
    console.error('API error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
