import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

// Only load Stripe if the key exists
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const removeFromCart = (id: number) => setCart(cart.filter(item => item.id !== id));
  const increaseQuantity = (id: number) =>
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  const decreaseQuantity = (id: number) =>
    setCart(cart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!stripePromise) {
      alert("Checkout is not available yet. Stripe keys are missing.");
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const data = await res.json();
      if (stripe && data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="mb-4">Your cart is empty.</p>
        <Link href="/" className="text-indigo-600 underline">
          Go back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Cart Items */}
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        {cart.map(item => (
          <div key={item.id} className="flex items-center border rounded-lg p-4 space-x-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image src={item.thumbnail} alt={item.title} fill className="object-cover rounded" sizes="80px"/>
            </div>
            <div className="flex-1">
              <Link href={`/products/${item.id}`} className="text-indigo-600 font-semibold hover:underline">
                {item.title}
              </Link>
              <p className="mt-1">Price: ${item.price.toFixed(2)}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                >−</button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                >+</button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="md:w-80 flex-shrink-0 sticky top-6 self-start bg-gray-50 p-4 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>

        {/* Thumbnails */}
        <div className="flex flex-col space-y-2 mb-4 max-h-60 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex items-center space-x-2">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src={item.thumbnail} alt={item.title} fill className="object-cover rounded" sizes="40px"/>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium truncate">{item.title}</p>
                <p>Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mb-4 font-semibold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Processing..." : stripePromise ? "Checkout Now" : "Checkout (Unavailable)"}
        </button>
      </div>
    </div>
  );
}
