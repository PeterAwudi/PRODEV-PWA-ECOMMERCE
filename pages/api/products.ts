import type { NextApiRequest, NextApiResponse } from 'next'
import products from '../../data/products.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  const limit = parseInt((query.limit as string) || '12', 10)
  const skip = parseInt((query.skip as string) || '0', 10)
  const category = (query.category as string) || ''
  const q = (query.q as string) || ''

  let filtered = products as any[]

  if (category) filtered = filtered.filter(p => p.category === category)
  if (q) {
    const qq = q.toLowerCase()
    filtered = filtered.filter(p => p.title.toLowerCase().includes(qq) || p.description.toLowerCase().includes(qq))
  }

  const total = filtered.length
  const slice = filtered.slice(skip, skip + limit)

  res.status(200).json({ products: slice, total, skip, limit })
}
