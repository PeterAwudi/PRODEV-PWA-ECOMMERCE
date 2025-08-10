import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  thumbnail?: string
  // Add other image fields if needed
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const cartRaw = localStorage.getItem('cart')
    if (cartRaw) {
      setCart(JSON.parse(cartRaw))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const increaseQty = (id: number) => {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    )
  }

  const decreaseQty = (id: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity - 1
          return { ...item, quantity: newQty > 0 ? newQty : 1 }
        }
        return item
      })
    )
  }

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/">
          <a className="text-indigo-600 underline">Go back to products</a>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Product</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Total</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id} className="border-b align-middle">
              <td className="p-2 flex items-center gap-4">
                {item.thumbnail && (
                  <div className="relative w-16 h-16 rounded overflow-hidden border">
                    <Image src={item.thumbnail} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
                <Link href={`/products/${item.id}`}>
                  <a className="text-indigo-600 hover:underline">{item.title}</a>
                </Link>
              </td>
              <td className="p-2">GHS {item.price.toFixed(2)}</td>
              <td className="p-2 flex items-center justify-center gap-2">
                <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 bg-gray-200 rounded">
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)} className="px-2 py-1 bg-gray-200 rounded">
                  +
                </button>
              </td>
              <td className="p-2">GHS {(item.price * item.quantity).toFixed(2)}</td>
              <td className="p-2">
                <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">
                  Remove
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="text-right font-bold p-2">
              Total:
            </td>
            <td colSpan={2} className="font-bold p-2">
              GHS {totalPrice.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-6 text-right">
        <button
          onClick={() => alert('Checkout not implemented')}
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

