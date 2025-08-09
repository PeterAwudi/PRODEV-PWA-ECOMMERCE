// pages/api/cart/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type { Cart, CartItem } from '../../../types/cart'

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
  const currency = 'GHS'
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  const cart_id = cartPartial.cart_id || randomUUID()
  const user = cartPartial.user || randomUUID()
  const items: CartItem[] = Array.isArray(cartPartial.items) ? cartPartial.items.map((it: any) => {
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

  const subtotal = Number(items.reduce((s, i) => s + i.total_price, 0).toFixed(2))

  return { cart_id, user, items, subtotal, currency, createdAt, updatedAt }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const carts = readCarts()
    return res.status(200).json(carts)
  }

  if (req.method === 'POST') {
    // Create or replace cart
    const body = req.body
    if (!body) return res.status(400).json({ message: 'Missing body' })

    const cart = sanitizeAndCompute(body)
    const carts = readCarts()
    // upsert by cart_id
    const idx = carts.findIndex(c => c.cart_id === cart.cart_id)
    if (idx >= 0) {
      carts[idx] = { ...cart, updatedAt: new Date().toISOString() }
    } else {
      carts.push(cart)
    }
    writeCarts(carts)
    return res.status(201).json(cart)
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
