// pages/products/[id].tsx
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Product } from '../../types/product';
import { useState } from 'react';

type Props = {
  product: Product;
};

export default function ProductPage({ product }: Props) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // If product already in cart, increase quantity
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{product.title}</h1>

      <Image
        src={product.thumbnail}
        alt={product.title}
        width={600}
        height={400}
        style={{ borderRadius: '8px', marginBottom: '1rem' }}
      />

      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        {product.description}
      </p>

      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Rating:</strong> {product.rating} ⭐</p>

      <button
        onClick={addToCart}
        style={{
          backgroundColor: added ? 'gray' : '#0070f3',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          cursor: added ? 'default' : 'pointer',
          marginTop: '1rem'
        }}
        disabled={added}
      >
        {added ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}

// Server-side fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  const res = await fetch(`http://localhost:3000/api/product/${id}`);
  const product = await res.json();

  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  return {
    props: { product },
  };
};

