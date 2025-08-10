import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Product } from '../../../types/product'

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await axios.get(`/api/products/${id}`)
        setProduct(response.data)
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Product not found')
        } else {
          setError('Failed to load product. Please try again.')
        }
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Simple function to add product to localStorage cart
  const addToCart = () => {
    if (!product) return

    const cartRaw = localStorage.getItem('cart')
    const cart = cartRaw ? JSON.parse(cartRaw) : []

    // Check if product already in cart
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingIndex >= 0) {
      // Increment quantity
      cart[existingIndex].quantity += 1
    } else {
      // Add new product with quantity 1
      cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    setAddedToCart(true)

    // Reset confirmation after 3 seconds
    setTimeout(() => setAddedToCart(false), 3000)
  }

  if (loading) {
    return <p className="p-6 text-center">Loading product...</p>
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => router.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!product) {
    return <p className="p-6 text-center">No product to display.</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-96 w-full bg-white rounded overflow-hidden">
          <Image
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <div className="mt-4">
            <span className="text-xl font-semibold">GHS {product.price}</span>
          </div>
          <button
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            onClick={addToCart}
            disabled={addedToCart}
          >
            {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}


