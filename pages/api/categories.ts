import type { NextApiRequest, NextApiResponse } from 'next'
import products from '../../data/products.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cats = Array.from(new Set((products as any[]).map(p => p.category)))
  res.status(200).json(cats)
}

