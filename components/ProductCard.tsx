import Link from 'next/link'
import Image from 'next/image'
import { Product } from '../types/products'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="block border rounded-lg bg-white hover:shadow-md overflow-hidden">
      <div style={{position:'relative',height:'12rem',width:'100%'}}>
        <Image src={product.thumbnail} alt={product.title} fill sizes="(max-width: 640px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{product.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">GHS {product.price}</span>
          <span className="text-xs text-gray-400">{product.category}</span>
        </div>
      </div>
    </Link>
  )
}
