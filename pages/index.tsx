import Head from 'next/head'
import Header from '../components/Header'
import Filters from '../components/Filters'
import ProductList from '../components/ProductList'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      <Head>
        <title>Detail's Catalog</title>
      </Head>

      {/* Header */}
      <Header />

      {/* Hero / Top Section */}
      <section className="bg-indigo-600 text-white py-16 mb-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Detail's Catalog
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Discover amazing products from electronics to fashion, all in one place.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters / Sidebar */}
        <aside className="lg:col-span-1 sticky top-24 bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="font-semibold text-xl mb-4 text-gray-700">Filter Products</h2>
          <Filters />
        </aside>

        {/* Product List */}
        <div className="lg:col-span-3">
          <ProductList />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        &copy; {new Date().getFullYear()} Detail's Catalog. All rights reserved.
      </footer>
    </div>
  )
}

