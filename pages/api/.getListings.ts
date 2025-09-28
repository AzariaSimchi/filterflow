import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET requests are allowed' })
  }

  const { title, description } = req.query

  if (!title || !description) {
    return res.status(400).json({ error: 'Missing title or description' })
  }

  const { data, error } = await supabase.from('listings').insert([
    { title, description }
  ])

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ message: 'Listing added!', data })
}
