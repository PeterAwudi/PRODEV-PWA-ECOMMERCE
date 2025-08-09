// pages/api/cart/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type { Cart } from '../../../types/cart'

const DATA_PATH = path.join(process.cwd(), 'data', 'carts.json')

function readCarts(): Cart[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(raw) as Cart[]
  } catch (err) {
    return []
  }
}
function writeCarts(carts: Cart[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(carts, null, 2))
}

function sanitizeAndCompute(cartPartial: any): Cart {
  const currency = cartPartial.currency || 'GHS'
  const createdAt = cartPartial.createdAt || new Date().toISOString()
  const updatedAt = new Date().toISOString()
  const cart_id = cartPartial.cart_id || randomUUID()
  const user = cartPartial.user || randomUUID()
  const items = Array.isArray(cartPartial.items) ? cartPartial.items.map((it: any) => {
    const price = Number(it.price) || 0
    const quantity = Number(it.quantity) || 0
    const product_name = it.product_name || it.name || ''
    const product = it.product || it.product_id || ''
    return {
      product,
      product_name,
      price,
      quantity,
      total_price: Number((price * quantity).toFixed(2))
    }
  }) : []
  const subtotal = Number(items.reduce((s: number, i: any) => s + i.total_price, 0).toFixed(2))
  return { cart_id, user, items, subtotal, currency, createdAt, updatedAt }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Invalid id' })
  const carts = readCarts()
  const idx = carts.findIndex(c => c.cart_id === id)

  if (req.method === 'GET') {
    if (idx === -1) return res.status(404).json({ message: 'Cart not found' })
    return res.status(200).json(carts[idx])
  }

  if (req.method === 'PUT') {
    const body = req.body
    if (!body) return res.status(400).json({ message: 'Missing body' })
    const newCart = sanitizeAndCompute({ ...body, cart_id: id })
    if (idx === -1) {
      carts.push(newCart)
    } else {
      carts[idx] = { ...newCart, updatedAt: new Date().toISOString() }
    }
    writeCarts(carts)
    return res.status(200).json(newCart)
  }

  if (req.method === 'DELETE') {
    if (idx === -1) return res.status(404).json({ message: 'Cart not found' })
    carts.splice(idx, 1)
    writeCarts(carts)
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
