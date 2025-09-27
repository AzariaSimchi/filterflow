import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = req.headers['x-webhook-secret'];
  if (!secret || secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Insert sample listing
  const { data, error } = await supabase.from('listings').insert([
    {
      source: 'manual',
      external_id: 'demo-1',
      title: 'Demo Property',
      price: 150000,
      currency: 'USD',
      address_text: '123 Demo St',
      city: 'Austin',
      state: 'TX',
      beds: 3,
      baths: 2,
      sqft: 1500,
    },
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Seed listing inserted', data });
}
