import Link from 'next/link'
import Image from 'next/image'
import { Product } from '../types/product' // <-- singular "product"
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="relative w-full h-48 block">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link
          href={`/product/${product.id}`}
          className="font-semibold text-lg truncate hover:text-indigo-600 transition-colors duration-200"
        >
          {product.title}
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-indigo-600 text-lg">
            GHS {product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400 capitalize">{product.category}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart({ ...product, quantity: 1 })}
          className="mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

