import type { NextApiRequest, NextApiResponse } from 'next';
import type { Product } from '../../types/product';
import products from '../../data/products.json';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | { message: string }>
) {
  const { id } = req.query;
  const pid = Number(id);
  const p = (products as Product[]).find(x => x.id === pid);

  if (!p) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.status(200).json(p);
}



