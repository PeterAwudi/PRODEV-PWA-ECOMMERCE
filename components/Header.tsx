import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { cart } = useCart()

  // Cart count updates reactively whenever 'cart' changes
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
        >
          DETAIL'S CATALOG
        </Link>

        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="hidden sm:inline-block border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-100 transition-colors duration-200"
          >
            <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
            <span className="font-medium text-gray-700">Cart</span>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}





