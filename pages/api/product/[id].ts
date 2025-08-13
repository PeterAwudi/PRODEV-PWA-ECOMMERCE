import type { NextApiRequest, NextApiResponse } from 'next'
import products from '../../../data/products.json' // adjust path as needed
import { Product } from '../../../types/product'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | { message: string }>
) {
  const { id } = req.query
  const pid = Number(id)
  const product = (products as Product[]).find(p => p.id === pid)

  if (!product) {
    return res.status(404).json({ message: 'Not found' })
  }

  return res.status(200).json(product)
}
