import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Product } from '../../types/product'

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axios.get(`/api/product/${id}`).then(r => setProduct(r.data)).catch(() => setProduct(null)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6">Loading...</p>
  if (!product) return <p className="p-6">Product not found</p>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-96 w-full bg-white rounded">
          <Image src={product.images?.[0] || product.thumbnail} alt={product.title} fill style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <div className="mt-4">
            <span className="text-xl font-semibold">GHS {product.price}</span>
          </div>
          <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded">Add to cart</button>
        </div>
      </div>
    </div>
  )
}
