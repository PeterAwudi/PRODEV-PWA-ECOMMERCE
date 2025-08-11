import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { Product } from '../../types/product'
import { useState } from 'react'

interface Props {
  product: Product | null
}

export default function ProductPage({ product }: Props) {
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) {
    return <p className="p-6 text-center text-red-600">Product not found.</p>
  }

  // Simple function to add product to localStorage cart
  const addToCart = () => {
    const cartRaw = localStorage.getItem('cart')
    const cart = cartRaw ? JSON.parse(cartRaw) : []

    const existingIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1
    } else {
      cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    setAddedToCart(true)

    setTimeout(() => setAddedToCart(false), 3000)
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${id}`)
    if (!res.ok) {
      return { props: { product: null } }
    }
    const product: Product = await res.json()

    return {
      props: { product },
    }
  } catch {
    return {
      props: { product: null },
    }
  }
}
