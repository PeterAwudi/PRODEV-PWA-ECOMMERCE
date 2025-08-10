import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline' // ✅ Trolley icon

export default function Header() {
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
          <button className="flex items-center gap-2 px-3 py-2 rounded border">
            <ShoppingCartIcon className="w-5 h-5 text-gray-700" /> {/* ✅ Icon visible */}
            Cart
          </button>
        </div>
      </div>
    </header>
  )
}


