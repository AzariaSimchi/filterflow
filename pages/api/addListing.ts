import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { title, description } = req.body

  if (!title || !description) {
    return res.status(400).json({ error: 'Missing title or description' })
  }

  const { data, error } = await supabase
    .from('listings')
    .insert([{ title, description }])

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json({ message: 'Listing added successfully', data })
}
