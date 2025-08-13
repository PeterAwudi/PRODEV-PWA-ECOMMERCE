import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const cartRaw = localStorage.getItem('cart')
    if (cartRaw) {
      const cart = JSON.parse(cartRaw)
      const totalQty = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(totalQty)
    }
  }, [])

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          DETAIL'S CATALOG
        </Link>
        <div className="flex gap-4 items-center">
          <input
            placeholder="Search"
            className="hidden sm:inline-block border p-2 rounded"
          />
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-3 py-2 rounded border hover:bg-gray-100"
          >
            <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}



